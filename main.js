Vue.component('cnpjform', {
  // The Template keeps the HTML of the component
  template: `
    <form class="cnpj-validation" @submit.prevent="onValidate">
      <p>
        <h3>CNPJ:</h3>
        <input type="text" id="cnpjField" @click="resetField" v-model="cnpjNumber" maxlength="18" minlength="14" placeholder="Ex.: 00.000.000/0001-00">
      </p>

      <p v-if="messages.length">
        <li v-for="message in messages">{{ message }}</li>
      </p>
        
      <p>
        <input id="btn" type="submit" @click="onValidate" value="Test CNPJ">
      </p>      

    </form> `
  ,
  // The Data keeps the variables used CNPJ Value and the Messages Array
  data() {
    return {
      cnpjNumber: null,
      messages: []
    }
  },
  // The Methods keeps the functions used
  methods: {
    // Cleans the Input Field and the Messages array
    resetField: function () {
      this.cnpjNumber = null
      this.messages.length = 0
    },
    // This Method validates the CNPJ FORMAT
    onValidate: function() {
      this.messages = []

      // Check for empty field      
      if (this.cnpjNumber !== null) {
        // Regex for both CNPJ formats
        let rgxCnpj = /[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}/g
        let rgxCnpjOnlyNum = /[0-9]{14}/g
        
        // this.resetField()
        // Match the expected expression with dots
        if (this.cnpjNumber.length === 18 && rgxCnpj.test(this.cnpjNumber)) {
          this.messages.push("CNPJ Receita Federal : VALID")

          // Calls a function that cleans the CNPJ to only numbers
          this.validCNPJToRF(this.cleanInputCnpj(this.cnpjNumber))  

        } else if (this.cnpjNumber.length === 14 && rgxCnpjOnlyNum.test(this.cnpjNumber)) {
          this.messages.push("CNPJ MASK : VALID")
          this.validCNPJToRF(this.cnpjNumber)

        } else {
          this.messages.push("CNPJ FORMAT : INVALID")
          this.validCNPJToRF(this.cleanInputCnpj(this.cnpjNumber))
        }
      } else {
        // this.resetField()
        this.messages.push("Please, fill the CNPJ input.")
      }

    },
    // This function cleans the CNPJ leaving just numbers
    cleanInputCnpj: function (cnpjInput) {
      // Remove dots, hyphen and bar
      let cleanCNPJ = cnpjInput.replace(/\./, "")
      cleanCNPJ = cleanCNPJ.replace(/\./, "")
      cleanCNPJ = cleanCNPJ.replace(/\//, "")
      cleanCNPJ = cleanCNPJ.replace(/\-/, "")
      return cleanCNPJ      
    },
    // This Method validates the CNPJ verifying digit as defined by Receita Federal 
    validCNPJToRF: function (cnpjInput) {
      let cleanCNPJ = cnpjInput
      let aux = 5
      let sum = 0
      let sum2 = 0      
      // Checks if the first Verifying digit is correct
      for(i=0; i<12; i++) {
        sum += cleanCNPJ[i] * (aux--)
        if (aux === 1) 
          aux = 9
      }
      sum = sum%11
      if (sum <2) {
        sum = 0
      } else {
        sum = 11 - sum
      }
      
      // Checks if the second Verifying digit is correct
      aux = 6
      sum2 = 0
      for(i=0; i<13; i++) {
        sum2 += cleanCNPJ[i] * (aux--)
        if (aux === 1) 
          aux = 9
      }
      
      sum2 = sum2%11
      if (sum2 <2) {
        sum2 = 0
      } else {
        sum2 = 11 - sum2
      }

      // Push's a Message Saying if CNPJ's Verifying Numbers are valid
      if (sum == cleanCNPJ[12] && sum2 == cleanCNPJ[13]) {
        this.messages.push("CNPJ VALIDATION : VALID According to Receita Federal")
      } else {
        this.messages.push("CNPJ VALIDATION : INVALID According to Receita Federal")
      }

    }

  }
})

var exerciseCnpj = new Vue ({
  el:'#exerciseCnpj'
})
