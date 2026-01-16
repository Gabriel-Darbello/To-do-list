# Padrão
{
  "rules": {
    ".read":  false,
    ".write": false
  }
}

# Publica
{
  "rules": {
    ".read":  true,
    ".write": true
  }
}

# Somente usuarios autenticados
{
  "rules": {
    ".read":  "auth != null",
    ".write": "auth != null"
  }
}

# O usuario só pode atualizar, ler ou remover itens que pertencem a ele
{
  "rules": {
    "users": {
      "$uid": {
        ".read":  "$uid == auth.uid",
        ".write": "$uid != auth.uid"
      }
    }
  }
}

# O usuario só pode atualizar, ler ou remover itens que pertencem ao seu uid e todos os itens devem ser string e ter no maximo 30 caracteres
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "$tid": {
          ".validate": "!newData.exists() || (
            newData.child('name').isString() &&
            newData.child('name').val().length <= 30
          )"
        }
      }
    }
  }
}

# O usuario só pode atualizar, ler ou remover itens do name padrão ou name lowerCase que pertencem ao seu uid e todos os itens devem ser string e ter no maximo 30 caracteres
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        ".indexOn": "nameLowerCase",
        "$tid": {
          ".validate": "!newData.exists() || (
            newData.child('name').isString() &&
            newData.child('name').val().length <= 30 &&
            newData.child('nameLowerCase').isString() &&
            newData.child('nameLowerCase').val().length <= 30
          )"
        }
      }
    }
  }
}
