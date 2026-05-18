const form = document.getElementById("loginForm")

form.addEventListener("submit", function (e) {

    e.preventDefault()

    let user = document.getElementById("username").value
    let pass = document.getElementById("password").value
    let error = document.getElementById("error")

    if (user === "" || pass === "") {
        error.innerText = "Please fill all fields"
        error.style.color = "#DC2626"
    }
    else if (pass.length < 6) {
        error.innerText = "Password must be at least 6 characters"
        error.style.color = "#DC2626"
    }
    else {
        error.style.color = "#10B981"
        error.innerText = "Login successful!"


        // Save login state
        localStorage.setItem("finscoutLoggedIn", "true");
        localStorage.setItem("finscoutEmail", user);

        

        // Redirect to investment page after successful login
        setTimeout(() => {
            window.location.href = "investment.html"
        }, 1000)
    }

})

