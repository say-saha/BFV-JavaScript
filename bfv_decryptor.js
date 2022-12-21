const Polynomial = require('./util/polynomial.js');
const Plaintext = require('./util/plaintext.js');

class BFVDecryptor {
      constructor(params, secret_key) {
            this.poly_degree = params.poly_degree;
            this.cipher_modulus = params.cipher_modulus;
            this.plain_modulus = params.plain_modulus;
            this.scaling_factor = params.scaling_factor;
            this.secret_key = secret_key;
      }

      decrypt(ciphertext_poly, c2) {
            let c0 = ciphertext_poly.c0;
            let c1 = ciphertext_poly.c1;
            // let intermed_message = c0.add(c1.multiply(this.secret_key.s, this.cipher_modulus), this.cipher_modulus); //Issue here
            let intermed_message = c1.multiply(this.secret_key.s, this.cipher_modulus);
            intermed_message = c0.add(intermed_message, this.cipher_modulus);

            if (arguments.length > 1) {
                let secret_key_squared = this.secret_key.s.multiply(this.secret_key.s, this.cipher_modulus);
                intermed_message = intermed_message.add(c2.multiply(secret_key_squared, this.cipher_modulus), this.cipher_modulus);
            }
            intermed_message = intermed_message.scalar_multiply(1 / this.scaling_factor);
            intermed_message = intermed_message.round();
            intermed_message = intermed_message.mod(this.plain_modulus);
            return new Plaintext(intermed_message);
      }
}


module.exports = BFVDecryptor;