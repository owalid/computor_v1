<template>
  <v-container>
    <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    >
      <v-textarea
        v-model="equation"
        :error-messages="result.error"
        name="input-7-1"
        label="Equation"
        required
      />
      <v-row align-center>
        <v-btn
          :disabled="!valid"
          color="success"
          class="mx-auto"
          @click="validate"
        >
          Calulate
        </v-btn>
      </v-row>
    </v-form>
    <v-row v-if="Object.keys(result).includes('degree_number')">
      <v-col cols="12">
        <span class="font-weight-bold mr-5">Polynome de degré :</span>
        <span class="font-weight-light">{{ result.degree_number }}</span>
      </v-col>
    </v-row>
    <v-row v-if="Object.keys(result).includes('reduced')">
      <v-col cols="12">
       <span class="font-weight-bold mr-5">Expression simplifié :</span>
       <span class="font-weight-light">{{ result.reduced }} = 0</span>
      </v-col>      
    </v-row>
    <v-row v-if="result.delta" no-gutters>
      <v-col>
       <span class="font-weight-bold mr-5">Δ :</span>
       <span class="font-weight-light">{{ result.delta.value }}</span>
      </v-col>
      <v-col>
       <span class="font-weight-bold mr-5">Signe de delta:</span>
       <span class="font-weight-light">{{ result.delta.sign }}</span>
      </v-col>   
    </v-row>
    <div v-if="result.reduced_solutions">
      <h3>Solutions reduites: </h3>
      <v-row v-for="(reduced_solution, reduced_solution_key) in result.reduced_solutions" :key="reduced_solution_key">
        <v-col cols="12">
          <span class="font-weight-bold">{{ reduced_solution_key }} :</span> 
          <span class="font-weight-light"> {{ reduced_solution }} </span>
        </v-col>
      </v-row>
    </div>
    <div v-if="result.solutions" class="mt-10">
      <h1>Solutions: </h1>
      <v-row v-for="(solution, solution_key) in result.solutions" :key="solution_key">
        <v-col cols="12">
          <span class="font-weight-bold">{{ solution_key }} :</span>
          <span class="font-weight-light"> {{ solution }} </span>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script>
export default {
  name: "FormSolver",
  data() {
    return {
      valid: '',
      equation: '',
      result: ''
    }
  },
  watch: {
    equation() {
      this.result = Object.assign({}, {});
    }
  },  
  methods: {
    validate() {
      const res = this.$calculate(this.equation)
      if (typeof res === 'object' && Object.keys(res).includes('degree_number') && Object.keys(res).includes('reduced') && Object.keys(res).includes('solutions')) {
        this.result = res
      } else {
        this.result = { error: "Veuillez entrer une equation bien formaté. Exemple: 5X^2 - X + 3 * X^1 - 1 X^2 = 0" }
      }
    }
  }
}
</script>