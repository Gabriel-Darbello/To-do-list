// variavel global
var updateTodoKey = null
// Função que envia as informações do input para o banco de dados
todoForm.onsubmit = function (event) {
  event.preventDefault() // Evita redirecionamento da pagina
  if (todoForm.name.value != '') {
    var file = todoForm.file.files[0] // Seleciona o primeiro arquivo da seleção de arquivos
    if (file != null){ // Verifica se o arquivo foi selecionado
      if (file.type.includes('image')) { // Verifica se o arquivo é uma imagem
        // Verifica se o arquivo é maior que 2mb
        if (file.size > 1024 * 1024 * 2){
          alert(`A imagem não pode ser maior que 2MB, a imagem selecionada tem: ${(file.size / 1024 / 1024).toFixed(3)}MB`)
          return
        }

        // Variavel que cria o nome do arquivo
        var imgName = firebase.database().ref().push().key + '-' + file.name
        // Variavel que cria o caminho do arquivo
        var imgPath = 'todoListFiles/' + firebase.auth().currentUser.uid + '/' + imgName
        // Cria uma referencia de arquivo usando o caminho criado em imgPath
        var storageRef = firebase.storage().ref(imgPath)
        // Inicia o processo de upload
        var upload = storageRef.put(file)
        trackUpload(upload).then( function () {
          storageRef.getDownloadURL().then(function (downloadURL) {
            var data = {
              imgURL: downloadURL,
              name: todoForm.name.value,
              nameLowerCase: todoForm.name.value.toLowerCase()
            }
            completeTodoCreate(data)
            todoForm.name.value = ''
            todoForm.file.value = ''
          })
        }).catch( function (error) {
          showError('Falha ao adicionar tarefa: ', error)
        })
      } else {
        alert('O arquivo selecionado precisa ser uma imagem! Tente novamente')
      }
    } else {
      var data = {
        name: todoForm.name.value,
        nameLowerCase: todoForm.name.value.toLowerCase()
      }
      completeTodoCreate(data)
    }
    var data = {
      name: todoForm.name.value,
      nameLowerCase: todoForm.name.value.toLowerCase()
    }
  } else {
    alert("O nome da tarefa não pode estar vazio!")
  }
}

// Completa a criação de tarefas (cria informações no banco de dados)
function completeTodoCreate(data) {
  dbRefUsers.child(firebase.auth().currentUser.uid).push(data).then( function () {
    console.log('A tarefa "' + data.name + '" foi adicionada com sucesso')
  }).catch( function (error) {
    showError('Falha ao adicionar tarefas, use no máximo 30 caracteres', error)
  })
    todoForm.name.value = ''
    todoForm.file.value = ''
}

function trackUpload(upload) {
      return new Promise(function (resolve, reject) {
        showItem(progressFeedback)
        upload.on('state_changed',
          function (snapshot) { // Segundo argumento: Recebe informações sobre o upload
            console.log((snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(2) + '%')
            progress.value = snapshot.bytesTransferred / snapshot.totalBytes * 100 + '%'
          },
          function (error) { // Terceiro argumento: função executada em caso de erro no upload
            hideItem(progressFeedback)
            reject(error)
          },
          function () { // Quarto argumento: função executada em caso de sucesso
            hideItem(progressFeedback)
            resolve()
          }
        )
        var playPauseUpload = true // Estado de controle do nosso upload (pausado ou em andamento)
        playPauseBtn.onclick = function () { // Botão para pausar e continuar de upload
          playPauseUpload = !playPauseUpload // Inverte o estado de controle do upload
          if (playPauseUpload){ // Se deseja retomar o upload, faça...
            upload.resume() // Retoma o upload
            playPauseBtn.innerHTML = 'Pausar'
            console.log('Upload retomado')
          } else {
            upload.pause() // Pausa o upload
            playPauseBtn.innerHTML = 'Continuar'
            console.log('Upload pausado')
          }
        }

        cancelBtn.onclick = function () { // Botão para cancelar upload
          upload.cancel() // Cancela o upload
          todoForm.value.innerHTML = ''
          hideItem(progressFeedback)
          resetTodoForm()
        }
      })
    }

// Função para exibir lista de tarefas para o usuario
function fillTodoList (dataSnapshot) {
  ulTodoList.innerHTML = ''
  var num = dataSnapshot.numChildren()
  todoCount.innerHTML = 'Você possui ' + num + (num > 1 || num == 0 ? ' tarefas' : ' tarefa') // exibe na interface o numero de tarefas
  dataSnapshot.forEach(function (item) {
    var value = item.val() // pega os valores de cada item do realtime database
    var li = document.createElement('li') // cria uma li
    var imgLi = document.createElement('img') // cria uma imagem
    imgLi.src = value.imgURL ? value.imgURL: './img/defaultTodo.png'// configura o src (source) da imagem, sendo a url padrão ou url enviada pelo usuario
    imgLi.setAttribute('class','imgTodo') // define classes de estilização
    var spanLi = document.createElement('span') // cria um span
    var liRemoveBtn = document.createElement('button') // cria um botão para deletar tarefas
    var liUpdateBtn = document.createElement('button') // cria um botão para deletar tarefas
    liUpdateBtn.appendChild(document.createTextNode('Atualizar tarefa')) // define o texto do botão
    liUpdateBtn.setAttribute('onclick', 'updateTodo("'+ item.key +'")')// configura o atributo do botão para atualizar tarefas
    liUpdateBtn.setAttribute('class', 'alternative todoBtn') // define classes para estilização
    liRemoveBtn.appendChild(document.createTextNode('Excluir tarefa')) // define o texto do botão
    liRemoveBtn.setAttribute('onclick', 'removeTodo("'+ item.key +'")')// configura o atributo do botão para remover tarefas
    liRemoveBtn.setAttribute('class', 'danger todoBtn') // define classes para estilizaçã
    li.id = item.key // define o id da li como a chave da tarefa
    spanLi.appendChild(document.createTextNode(value.name)) // adiciona um elemento de texto dentro do span
    li.appendChild(imgLi)// adiciona o img no li
    li.appendChild(spanLi) // adiciona o span dentro da li
    li.appendChild(liRemoveBtn) // adiciona o botão no li
    li.appendChild(liUpdateBtn) // adiciona o botão no li
    ulTodoList.appendChild(li) // adiciona a li dentro da ul
  })
}

// Função para remover tarefas do banco de dados
function removeTodo(key) {
  var todoName = document.querySelector('#' + key + ' > span')
  var todoImg = document.querySelector('#' + key + '> img')
  var confirmation = confirm(`Realmente deseja remover a tarefa "${todoName.innerHTML}"?`);
  if (confirmation) {
    dbRefUsers.child(firebase.auth().currentUser.uid).child(key).remove().then( function () {
      console.log('A tarefa "' + todoName.innerHTML + '" foi excluida com sucesso')
      removeFile(todoImg.src)
    }).catch( function (error) {
      showError('Falha ao remover tarefas', error)
    })
  }
}

// Função para remover arquivos do banco de dados
function removeFile(imgUrl) {
  console.log(imgUrl)
  // verifica se o imgUrl contém a imagem padrão de tarefas
  var result = imgUrl.indexOf('img/defaultTodo.png')
  // Se não for a imagem padrão de tarefas delete a imagem
  if (result == -1) {
    firebase.storage().refFromUrl(imgUrl).delete().then( function () {
      console.log('Arquivo removido com sucesso')
    }).catch(function (error) {
      console.log('Falha ao remover arquivo')
      console.log(error)
    })
  } else {
    console.log('Nenhum arquivo removido') // se a imagem for a padrão não é deletadp
  }
}

// Função para preparar atualização de tarefas
function updateTodo(key) {
  updateTodoKey = key // Atribui o conteudo de key dentro de uma variavel global
  var todoName = document.querySelector('#' + key + ' > span')
  // Altera o titulo da tarefa
  todoFormTitle.innerHTML = '<strong>Editar tarefa: </strong>' + todoName.innerHTML
  // Altera o texto da entrada de nome (coloca o nome da tarefa a ser atualizado)
  todoForm.name.value = todoName.innerHTML

  hideItem(submitTodoForm)
  showItem(cancelUpdateTodo)
}

// Restaura o formulario de tarefas
function resetTodoForm() {
  todoFormTitle.innerHTML = 'Adicionar tarefa'
  hideItem(cancelUpdateTodo)
  submitTodoForm.style.display = 'initial'
  todoForm.name.value = ''
  todoForm.file.value = ''
}

// Faz a confirmação da alteração de tarefas
function confirmTodoUpdate() {
  if (todoForm.name.value != '') {
    var todoImg = document.querySelector('#' + updateTodoKey + '> img')
    var file = todoForm.file.files[0] // Seleciona o primeiro arquivo da seleção de arquivos
    if (file != null){ // Verifica se o arquivo foi selecionado
      if (file.type.includes('image')) { // Verifica se o arquivo é uma imagem
        // Verifica se o arquivo é maior que 2mb
        if (file.size > 1024 * 1024 * 2){
          alert(`A imagem não pode ser maior que 2MB, a imagem selecionada tem: ${(file.size / 1024 / 1024).toFixed(3)}MB`)
          return
        }

        hideItem(cancelUpdateTodo)
        // Variavel que cria o nome do arquivo
        var imgName = firebase.database().ref().push().updateTodoKey + '-' + file.name
        // Variavel que cria o caminho do arquivo
        var imgPath = 'todoListFiles/' + firebase.auth().currentUser.uid + '/' + imgName
        // Cria uma referencia de arquivo usando o caminho criado em imgPath
        var storageRef = firebase.storage().ref(imgPath)
        // Inicia o processo de upload
        var upload = storageRef.put(file)
        trackUpload(upload).then( function () {
          storageRef.getDownloadURL().then( function (downloadURL) {
            var data = {
              imgUrl: downloadURL,
              name: todoForm.name.value,
              nameLowerCase: todoForm.name.value.toLowerCase()
            }
            completeTodoUpdate(data, todoImg.src)
          })
        }).catch(function (error) {
          showError('Erro ao atualizar a tarefa: ', error)
        })
      } else { // Se o arquivo selecionado não for uma imagem
        alert('O arquivo selecionado precisa ser uma imagem')
      }
    } else { // Se nenhuma imagem for selecionada
      var data = {
        name: todoForm.name.value,
        nameLowerCase: todoForm.name.value.toLowerCase()
      }
      completeTodoUpdate(data)
    }
  } else {
    alert('O campo não pode estar vazio!')
  }
}

// completa a atualização de tarefas (persiste as informações no banco de dados)
function completeTodoUpdate(data, imgUrl) {
  dbRefUsers.child(firebase.auth().currentUser.uid).child(updateTodoKey).update(data).then(function () {
    console.log(`Tarefa "${data.name}" atualizada com sucesso`)
    if (imgUrl) {
      removeFile(imgUrl) // Remove a imagem antiga
    }
  }).catch(function (error) {
    showError('Falha ao atualizar tarefa: ', error)
      })
  resetTodoForm() // Restaura o formulario de tarefas
}
