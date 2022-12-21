class BFVParameters {
      constructor(poly_degree, plain_modulus, cipher_modulus) {
            this.poly_degree = poly_degree;
            this.plain_modulus = plain_modulus;
            this.cipher_modulus = cipher_modulus;
            this.scaling_factor = this.cipher_modulus / this.plain_modulus;
      }

      print_parameters() {
            console.log("BFV Parameters: ");
            console.log("Polynomial Degree: ", this.poly_degree);
            console.log("Plaintext Modulus: ", this.plain_modulus);
            console.log("Ciphertext Modulus: ", this.cipher_modulus);
      }
}

module.exports = BFVParameters