import csv
# import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import re
import time
import pandas as pd

def get_location_details(place_name):
    base_url = "https://www.google.com/maps/search/"
    search_query = f"{place_name}"
    search_url = f"{base_url}{search_query}"
    # 使用 Selenium 開啟瀏覽器
    driver = webdriver.Chrome()
    driver.get(search_url)
    time.sleep(1)
    
    # 取得完整的 HTML 內容
    page_source = driver.page_source

    driver.quit()

    soup = BeautifulSoup(page_source, 'html.parser')
    # print(search_url)
    try:
        details_url = soup.find('a', {'href': re.compile('https://www.google.com/maps/place/.*')})['href']
    except:
        return get_location_text(search_url)

    # print(details_url)
    return get_location_text(details_url)
    
def get_location_text(details_url):
    try:
        # Create ChromeOptions and set the profile path
        chrome_options = Options()
        user_data_dir = r'C:\Users\she91\AppData\Local\Google\Chrome\User Data\Profile 1'


        chrome_options.add_argument(f'--user-data-dir={user_data_dir}')
        chrome_options.add_argument("--disable-features=ClipboardContentSetting")
        chrome_options.add_argument("--disable-site-isolation-trials")  # 添加這一行

        # chrome_options.add_experimental_option("prefs", {"profile.content_settings.exceptions.clipboard": {"[*.]httpbin.org,*": {'last_modified': (time.time()*1000), 'setting': 1}}})
        # 使用 Selenium 開啟瀏覽器
        driver = webdriver.Chrome(options=chrome_options)
        
        driver.get(details_url)
        time.sleep(1)
        
        # 找到並點擊 "複製地址" 按鈕
        # copy_button = driver.find_element_by_css_selector('button[aria-label="複製地址"]')
        copy_button = driver.find_element(By.CSS_SELECTOR, 'button[aria-label="複製地址"]')
        copy_button.click()

        # 取得剪貼簿的內容
        address = driver.execute_script("return navigator.clipboard.readText();")
        # print(f"address: {address}")

        # 關閉瀏覽器
        driver.quit()

        if address:
            return address
        
        return " "
    except:
        return " "

def add_address():
    with open('./public/data/data.csv', newline='', encoding='utf-8') as csvfile, \
         open('./public/data/data_with_addresses.csv', 'w', newline='', encoding='utf-8-sig') as outputfile:

        reader = csv.DictReader(csvfile)
        fieldnames = reader.fieldnames + ['地址']
        
        # 建立 CSV 寫入器
        writer = csv.DictWriter(outputfile, fieldnames=fieldnames)
        writer.writeheader()
        for i, row in enumerate(reader):
            if i == 0: continue
            # if i > 2: break
            place_name = row['遊憩據點']
            location_details = get_location_details(place_name)
            if location_details == " ":
                print(i, place_name)
            # print(f"景點：{place_name}，地址：{location_details}")
            row['地址'] = location_details
            writer.writerow(row)
            time.sleep(1)
            

def change_date():
    # 读取 CSV 文件
    df = pd.read_csv('./public/data/data_with_addresses.csv', encoding='utf-8', nrows=1)

    # 获取日期列的列索引
    # print(df)
    date_columns = df.columns[6:][:-2]
    # print(date_columns)

    # 将列索引中的 '年' 和 '月' 替换为 '/'
    # new_column_names = [col.replace('年', '/').replace('月', '') for col in date_columns]
    new_column_names = [f"{int(year)+1911}/{month.zfill(2)}" for col in date_columns for year, month in [col.replace('年', '/').replace('月', '').split('/')]]
    # let year + 1991
    # EX: 112/09 => 112+1911 = 2023/09
    # 将 DataFrame 的列索引更新为新的列名
    df.columns = df.columns[:6].tolist() + new_column_names + list(df.columns[-2:])

    # 打印处理后的 DataFrame
    print(df.columns)
    
    df.to_csv('./public/data/modified_data.csv', index=False, header=True, encoding='utf-8-sig')
    # # # 对每一列应用转换函数
    # for col in date_columns:
    #     print(df[col])
    #     return
    #     df[col] = df[col].apply(lambda x: f"{int(x[:4])+1991}/{x[4:]}")
    # # 将日期列转换为 datetime 类型
    # df[date_columns] = df[date_columns].apply(pd.to_datetime, format='%Y/%m')

    # # 将修改后的 DataFrame 写回 CSV 文件
    # df.to_csv('modified_file.csv', index=False, encoding='utf-8-sig')


if __name__ == "__main__":
    change_date()
    # add_address()
    pass
