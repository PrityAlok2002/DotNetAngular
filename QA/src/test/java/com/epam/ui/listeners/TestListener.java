package com.epam.ui.listeners;

import com.epam.ui.browsers.BrowserFactory;
import org.openqa.selenium.WebDriver;
import org.testng.ITestListener;

public class TestListener implements ITestListener {
    public void onTestFailure() {
        WebDriver driver = BrowserFactory.getDriver("chrome");
        System.out.println("Test failed");
    }
}
