export type Dvp = {
    "version": "0.1.0",
    "name": "dvp",
    "instructions": [
      {
        "name": "singup",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "userAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "dcId",
            "type": "u64"
          },
          {
            "name": "dcName",
            "type": "string"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "userAccount",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "state",
              "type": "u8"
            },
            {
              "name": "wallet",
              "type": "publicKey"
            },
            {
              "name": "discordId",
              "type": "u64"
            },
            {
              "name": "discordName",
              "type": "string"
            }
          ]
        }
      }
    ]
  };
  
  export const IDL: Dvp = {
    "version": "0.1.0",
    "name": "dvp",
    "instructions": [
      {
        "name": "singup",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "userAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "dcId",
            "type": "u64"
          },
          {
            "name": "dcName",
            "type": "string"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "userAccount",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "state",
              "type": "u8"
            },
            {
              "name": "wallet",
              "type": "publicKey"
            },
            {
              "name": "discordId",
              "type": "u64"
            },
            {
              "name": "discordName",
              "type": "string"
            }
          ]
        }
      }
    ]
  };
  