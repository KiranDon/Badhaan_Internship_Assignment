let topButtonLogin = document.querySelector(".topButtonLogin");
let topButtonSignUp = document.querySelector(".topButtonSignUp");
let registerButton = document.getElementById("registerButton");
let errorMessage = document.getElementById("errorMessage");
let divForEmail = document.getElementById("divForEmail");
let divForFullName = document.getElementById("divForFullName");
let divForPassword = document.getElementById("divForPassword");
let divForConfirmPassword = document.getElementById("divForConfirmPassword");
let divForEmailLogin = document.getElementById("divForEmailLogin");
let divForPasswordLogin = document.getElementById("divForPasswordLogin");
let divForMobile = document.getElementById("divForMobile");
let divForPlace = document.getElementById("divForPlace");
let openEyes = document.querySelectorAll(".eyeOpen");

topButtonLogin.addEventListener("click", ()=>{
    document.querySelector(".shade").classList.remove("active");
    document.querySelector(".topSignIn").classList.add("hidden");
    document.querySelector(".topSignUp").classList.remove("hidden");
    document.querySelector(".signInSection").classList.remove("hidden");
    document.querySelector(".signUpSection").classList.add("hidden");
    document.querySelector(".topSignUpImage").classList.remove("hidden");
});

topButtonSignUp.addEventListener("click", ()=>{
    document.querySelector(".shade").classList.add("active");
    document.querySelector(".topSignIn").classList.remove("hidden");
    document.querySelector(".topSignUp").classList.add("hidden");
    document.querySelector(".signInSection").classList.add("hidden");
    document.querySelector(".signUpSection").classList.remove("hidden");
    document.querySelector(".topSignUpImage").classList.add("hidden");
});

function validateRegister(){
    let email = document.getElementById("email").value;
    let fullName = document.getElementById("fullName").value;
    let mobile = document.getElementById("mobile").value;
    let place = document.getElementById("place").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    errorMessage.innerText = "";
    clearDivs();

    if(!isValidEmail(email)){
        alert("Invalid Email.");
        divForEmail.classList.add("error");
        document.getElementById("email").focus();
        return false;
    }else if(fullName.length < 3){
        alert("Full name should contain atleast 3 characters.");
        divForFullName.classList.add("error");
        document.getElementById("fullName").focus();
        return false;
    }else if(mobile.length!=10){
        alert("Invalid Phone Number.");
        divForMobile.classList.add("error");
        document.getElementById("mobile").focus();
        return false;
    }else if(place.length < 3){
        alert("Place should contain atleast 3 characters.");
        divForPlace.classList.add("error");
        document.getElementById("place").focus();
        return false;
    }else if(!isValidPassword(password)){
        alert("Password should contain at least 8 characters including 1 special chacter, 1 uppercase and 1 lower case letter.");
        divForPassword.classList.add("error");
        document.getElementById("password").focus();
        return false;
    }else if(password!=confirmPassword){
        divForConfirmPassword.classList.add("error");
        document.getElementById("confirmPassword").focus();
        alert("Both passwords should match.")
        return false
    }else{
        return true;
    }
}

function validateLogin(){
    let usernameLogin = document.getElementById("usernameLogin").value;
    let passwordLogin = document.getElementById("passwordLogin").value;

    clearDivs();

    if(!isValidEmail(usernameLogin)){
        divForEmailLogin.classList.add("error");
        document.getElementById("usernameLogin").focus();
        alert("Invalid Email.");
        return false;
    }else if(!isValidPassword(passwordLogin)){
        divForPasswordLogin.classList.add("error");
        document.getElementById("passwordLogin").focus();
        alert("Invalid Password.");
        return false;
    }else{
        return true;
    }
}

function clearDivs(){
    divForEmail.classList.remove("error");
    divForFullName.classList.remove("error");
    divForPassword.classList.remove("error");
    divForConfirmPassword.classList.remove("error");
    divForEmailLogin.classList.remove("error");
    divForPasswordLogin.classList.remove("error");
    divForPlace.classList.remove("error");
    divForMobile.classList.remove("error");
}

function isValidPassword(password){
    let re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
}

function isValidEmail(email){
    // console.log(email)
    if (email.endsWith("@gmail.com") || email.endsWith("@rguktsklm.ac.in") || email.endsWith("@rguktn.ac.in")){
        return true;
    }
    return false;
}

openEyes.forEach(eye=>{
    eye.addEventListener("click", eyeClicked);
})

function eyeClicked(e){
    let element = e.target;
    if(element.classList.contains("fa-eye-slash")){
        hidePassword(e);
    }else{
        showPassword(e)
    }
}

function showPassword(e){
    let field = e.target.previousElementSibling;
    let eye = e.target;
    field.type="text";
    eye.classList.remove("fa-eye");
    eye.classList.add("fa-eye-slash");
}
function hidePassword(e){
    let field = e.target.previousElementSibling;
    let eye = e.target;
    field.type="password";
    eye.classList.remove("fa-eye-slash");
    eye.classList.add("fa-eye");
}