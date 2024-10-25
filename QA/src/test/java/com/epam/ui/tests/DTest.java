package com.epam.ui.tests;

import com.epam.ui.browsers.BrowserFactory;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.Test;

public class DTest {

    @Test
    public void demotest(){
        WebDriver driver = BrowserFactory.getDriver("chrome");
        driver.get("https://www.google.com");
        driver.manage().window().maximize();
    }
}
