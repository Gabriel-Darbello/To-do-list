// Variaveis pegando os elementos do html
// Elementos da aba de autenticação
var auth = document.getElementById('auth')
var authForm = document.getElementById('authForm')
var authFormTitle = document.getElementById('authFormTitle')
// Botões de registro, entrar e resetar senha
var register = document.getElementById('register')
var access = document.getElementById('access')
var passwordReset = document.getElementById('passwordReset')
// Gif de carregamento
var loading = document.getElementById('loading')
// Conteudo de usuario e seu email
var userContent = document.getElementById('userContent')
var userEmail = document.getElementById('userEmail')
// Elementos da verificação de email
var sendEmailVerificationDiv = document.getElementById('sendEmailVerificationDiv')
var emailVerified = document.getElementById('emailVerified')
// Imagem e nome de usuario
var userImg = document.getElementById('userImg')
var userName = document.getElementById('userName')
// Elementos do formulario de todo list
var todoForm = document.getElementById('todoForm')
var todoCount = document.getElementById('todoCount')
var ulTodoList = document.getElementById('ulTodoList')
var todoListContent = document.getElementById('todoListContent')
var todoFormTitle = document.getElementById('todoFormTitle')
var submitTodoForm = document.getElementById('submitTodoForm')
// Elementos para pesquisa e ordenação de tarefas
var search = document.getElementById('search')
// Elementos de progressão de upload
var progressFeedback = document.getElementById('progressFeedback')
var progress = document.getElementById('progress')
var playPauseBtn = document.getElementById('playPauseBtn')
var playPauseBtn = document.getElementById('playPauseBtn')
var cancelBtn = document.getElementById('cancelBtn')
// Elementos de modificações de tarefas
var cancelUpdateTodo = document.getElementById('cancelUpdateTodo')

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
  getDefaultTodoList()
  search.onkeyup =  function () {
    // Busca tarefas filtradas somente uma vez usando .get
    if (search.value != '') {
      var searchText = search.value.toLowerCase()
      dbFirestore.doc(firebase.auth().currentUser.uid).collection('tarefas')
     .orderBy('nameLowerCase') // ordena as tarefas pelo nome
     .startAt(searchText).endAt(searchText + '\uf8ff') // delimita os resultados de pesquisa
     .get().then(function (dataSnapshot) {
      fillTodoList(dataSnapshot)
     })
    } else {
      getDefaultTodoList()
    }
  }
  showItem(userContent)
  userEmail.innerHTML = 'Email do usuario: ' + user.email
  userImg.src = user.photoURL ? user.photoURL : 'img/unknownUser.png'
  userName.innerHTML = user.displayName

  if (user.providerData[0].providerId != 'password') {
    emailVerified.innerHTML = 'E-mail verificado'
    hideItem(sendEmailVerificationDiv)
    showItem(todoListContent)
  } else {
    if (user.emailVerified) {
      emailVerified.innerHTML = 'E-mail verificado'
      hideItem(sendEmailVerificationDiv)
      showItem(todoListContent)
    } else {
      emailVerified.innerHTML = 'Verifique seu e-mail para acessar os recursos.'
      showItem(sendEmailVerificationDiv)
      hideItem(todoListContent)
    }
  }
}

// Busca e exibição de tarefas em tempo real (listagem padrão usando .onSnapshot)
function getDefaultTodoList() {
  dbFirestore.doc(firebase.auth().currentUser.uid).collection('tarefas')
  .orderBy('nameLowerCase').onSnapshot(function (dataSnapshot) {
    fillTodoList(dataSnapshot)
  })
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
  url: window.location.origin
}

// Realtime database
var database = firebase.database()
var dbRefUsers = database.ref('users')
// Referencia ao cloud firestore
var dbFirestore = firebase.firestore().collection('users')

// centralizar e traduzir erro
function showError(prefix, error) {
  console.log(error.code)
  hideItem(loading)

  switch (error.code) {
    case 'auth/internal-error':
    case 'auth/invalid-email':
    case 'auth/wrong-password': alert(prefix + 'Email ou senha inválidos, digite novamente!')
    break
    case 'auth/weak-password': alert(prefix + 'Senha deve ter pelo menos 6 caracteres!')
    break;
    case 'auth/email-already-in-use': alert(prefix + 'O email já está em uso, utilize outro email!')
    break;
    case 'auth/popup-closed-by-user': alert(prefix + 'O popup de autencicação foi fechado antes da operação ser concluida! ')
    break;
    case 'storage/canceled':
    break;
    case 'storage/unauthorized': alert(prefix + 'Falha ao acessar o Cloud Firestore')
    default: alert(prefix + ' ' + error.message)
  }
}
