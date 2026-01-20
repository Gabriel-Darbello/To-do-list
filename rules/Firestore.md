# Modo de teste
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

# Modo bloqueado
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}

# Limita o usuario para manipular somente os dados ligados ao ser user e também o tipo e tamanho permitindo apenas strings (texto) com até 30 caracteres
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match users/{uid}/{document=**} {
      allow read, delete: if request.auth.uid == uid;
      allow create, update: if request.auth.uid == uid
        && request.resource.data.name is string
        && request.resource.data.name.size() <= 30
        && request.resource.data.nameLowerCase is string
        && request.resource.data.nameLowerCase.size() <= 30;
    }
  }
}
