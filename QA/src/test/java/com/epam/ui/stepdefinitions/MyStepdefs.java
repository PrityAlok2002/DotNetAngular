package com.epam.ui.stepdefinitions;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class MyStepdefs {
    @Given("User is on the login page")
    public void userIsOnTheLoginPage() {
        System.out.println("On login page");
    }

    @When("User enters valid credentials")
    public void userEntersValidCredentials() {
        System.out.println("entered valid credentials");
    }

    @Then("User is redirected to the home page")
    public void userIsRedirectedToTheHomePage() {
        System.out.println("redirected to home page");
    }
}
