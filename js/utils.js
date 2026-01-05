// Variaveis pegando os elementos do html
var authForm = document.getElementById('authForm')
var authFormTitle = document.getElementById('authFormTitle')

var register = document.getElementById('register')
var access = document.getElementById('access')
var passwordReset = document.getElementById('passwordReset')

var loading = document.getElementById('loading')

var auth = document.getElementById('auth')
var userContent = document.getElementById('userContent')
var userEmail = document.getElementById('userEmail')

var sendEmailVerificationDiv = document.getElementById('sendEmailVerificationDiv')
var emailVerified = document.getElementById('emailVerified')

var userImg = document.getElementById('userImg')
var userName = document.getElementById('userName')

// alterar o formulario de autenticação para o cadastro de novas contas
function toggleToRegister() {
  authForm.submitAuthForm.innerHTML = "Criar conta"
  authFormTitle.innerHTML = "Crie sua conta para continuar"
  
  hideItem(register)
  hideItem(passwordReset)
  showItem(access)
}

// alterar o formulario de autenticação para entrar em uma conta existente
function toggleToAccess() {
  authForm.submitAuthForm.innerHTML = "Entrar"
  authFormTitle.innerHTML = "Entre na sua conta para continuar"
  
  hideItem(access)
  showItem(register)
  showItem(passwordReset)
}

// simplifica a exibição de elementos da pagina
function showItem(element) {
  element.style.display = 'block'
}

// simplifica a ocultação de elementos da pagina
function hideItem(element) {
  element.style.display = 'none'
}

//função para exibir conteudo do usuario
function showUserContent(user) {
  hideItem(auth)
  showItem(userContent)
  userEmail.innerHTML = 'Email do usuario: ' + user.email
  userImg.src = user.photoURL ? user.photoURL : 'img/unknownUser.png'
  userName.innerHTML = user.displayName

  if (user.providerData[0].providerId != 'password') {
    emailVerified.innerHTML = 'E-mail verificado'
    hideItem(sendEmailVerificationDiv)
  } else {
    if (user.emailVerified) {
      emailVerified.innerHTML = 'E-mail verificado'
      hideItem(sendEmailVerificationDiv)
    } else {
      emailVerified.innerHTML = 'E-mail não verificado'
      showItem(sendEmailVerificationDiv)
    }
  }
}

//função para exibir conteudo de login
function showAuth() {
  authForm.email.value = ''
  authForm.password.value = ''
  hideItem(userContent)
  showItem(auth)
}

// atributos extras de configuração de email
var actionCodeSettings = {
  url: 'to-do-list-c1c83.firebaseapp.com'
}