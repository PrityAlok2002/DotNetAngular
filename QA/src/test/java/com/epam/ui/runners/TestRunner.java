package com.epam.ui.runners;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;
import org.testng.annotations.Test;

@CucumberOptions(
        features = "src/test/resources/features",
        glue = "com/epam/ui/stepdefinitions",
        plugin = {"pretty", "html:target/cucumber-reports","io.qameta.allure.cucumber7jvm.AllureCucumber7Jvm"},
        publish = true,
        monochrome = true
)
//@Test
public class TestRunner extends AbstractTestNGCucumberTests {

}
