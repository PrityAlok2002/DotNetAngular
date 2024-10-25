Feature: Login
  Scenario: User logs in to the app
    Given User is on the login page
    When User enters valid credentials
    Then User is redirected to the home page