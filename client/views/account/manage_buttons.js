/*
``client\views\account\`` manage_buttons.js
## Event for the template manage_buttons.html */


Template._loginButtonsLoggedInDropdown.events({
    'click #login-buttons-edit-profile': function(event) {
        Router.go('manage_account');
    }
});