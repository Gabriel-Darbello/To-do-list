// tradução do programa para portugues brasileiro
firebase.auth().languageCode = 'pt-BR'

// função para entrar ou criar uma conta
authForm.onsubmit = function (event) {
  event.preventDefault()
  showItem(loading)

  if (authForm.submitAuthForm.innerHTML == 'Entrar') {
    firebase.auth().signInWithEmailAndPassword(authForm.email.value, authForm.password.value).catch(function (error) {
      showError("Falha no acesso: ", error)
    })
  } else {
    firebase.auth().createUserWithEmailAndPassword(authForm.email.value, authForm.password.value).catch(function (error) {
      showError("Falha no cadastro: ", error)
    })
  }
}

// função que analisa o status de autenticação do usuario
firebase.auth().onAuthStateChanged( function (user) {
  hideItem(loading)
  if (user) {
    console.log('Usuario autenticado')
    console.log(user)
    showUserContent(user)
  } else {
    console.log('Usuario não autenticado')
    showAuth()
  }
})

// função para sair da conta
function signOut() {
  firebase.auth().signOut().catch( function (error) {
  showError('Falha ao sair da conta: ', error)
})
}

// função para verificação de email
function sendEmailVerification() {
  var user = firebase.auth().currentUser
  showItem(loading)
  user.sendEmailVerification(actionCodeSettings).then( function () {
    alert('Email de verificação enviado para ' + user.email + '! Verifique sua caixa de entrada ou spam.' )
  }).catch( function (error) {
    showError('Falha ao enviar email de verificação: ', error)
  }).finally( function () {
    hideItem(loading)
  })
}

// função para redefinir senha através de um email enviado para o usuario
function sendPasswordResetEmail () {
  var email = prompt("Insira seu email para redefinir sua senha!", authForm.email.value)
  if (email) {
    showItem(loading)
    firebase.auth().sendPasswordResetEmail(email, actionCodeSettings).then( function () {
      alert('Email de redefinição de senha enviado para ' + email + '! verifique sua caixa de entrada ou spam.')
    }).catch( function (error) {
      showError('Falha ao enviar email de redefinição de senha: ', error)
    }).finally( function () {
      hideItem(loading)
    })
  } else {
    alert('É preciso preencher o campo de email para redefinir a senha!')
  }
}

// função para fazer autenticação com o google
function signInWithGoogle () {
  showItem(loading)
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function (error) {
    showError('Falha ao autenticar com o Google: ', error)
    hideItem(loading)
  })
}

function signInWithGithub () {
  showItem(loading)
  firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider()).catch(function (error) {
    showError('Falha ao autenticar com o Github: ', error)
    hideItem(loading)
  })
}

// função para atualizar o nome de usuario
function updateUserName () {
  var newUserName = prompt('Informe um novo nome de usuario.', userName.innerHTML)
  if (newUserName && newUserName != '') {
    userName.innerHTML = newUserName
    showItem(loading)
    firebase.auth().currentUser.updateProfile({
      displayName: newUserName
    }).catch( function (error) {
      showError('Falha ao atualizar nome de usuario: ', error)
    }).finally( function () {
      hideItem(loading)
    })
  } else {
    alert('O nome de usuario não pode ser vazio')
  }
}

// função para deletar conta do usuario
function deleteUserAccount() {
  var confirmation = confirm("Realmente deseja excluir sua conta?")
  if (confirmation) {
    showItem(loading)
    firebase.auth().currentUser.delete().then(function () {
      alert("Conta excluida com sucesso")
    }).catch( function (error) {
      showError('Falha ao excluir sua conta: ', error)
    }).finally(function () {
      hideItem(loading)
    })
  }
}

// centralizar e traduzir erro
function showError(prefix, error) {
  console.log(error.code)
  hideItem(loading)

  switch (error.code) {
    case 'auth/internal-error':
    case 'auth/invalid-email': 
    case 'auth/wrong-password': alert(prefix + 'Email ou senha inválidos, digite novamente!')
    break;

    case 'auth/weak-password': alert(prefix + 'Senha deve ter pelo menos 6 caracteres!')
    break;

    case 'auth/email-already-in-use': alert(prefix + 'O email já está em uso, utilize outro email!')
    break;

    case 'auth/popup-closed-by-user': alert(prefix + 'O popup de autencicação foi fechado antes da operação ser concluida! ')
    break;

    default: alert(prefix + ' ' + error.message)
  }
}