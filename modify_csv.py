import csv
# import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import re
import time

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

def main():
    with open('./public/data.csv', newline='', encoding='utf-8') as csvfile, \
         open('./public/data_with_addresses.csv', 'w', newline='', encoding='utf-8-sig') as outputfile:

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

if __name__ == "__main__":
    main()
