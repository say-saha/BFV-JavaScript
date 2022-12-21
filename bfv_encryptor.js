const Polynomial = require('./util/polynomial.js');
const RandomSample = require('./util/random_sample.js');
const Ciphertext = require('./util/ciphertext.js');

class BFVEncryptor {
      constructor(params, public_key) {
            this.poly_degree = params.poly_degree;
            this.coeff_modulus = params.cipher_modulus;
            this.public_key = public_key;
            this.scaling_factor = parseInt(params.scaling_factor);
      }

      encrypt(message_poly) {
            let p0 = this.public_key.p0;
            let p1 = this.public_key.p1;
            // console.log("Scaling factor: ", this.scaling_factor);
            // console.log("coeff modulus: ", this.coeff_modulus)
            let scaled_message = message_poly.scalar_multiply(this.scaling_factor, this.coeff_modulus);
            // console.log("Scaled message: ", scaled_message.coeffs);
            
            let random_vec = new Polynomial(this.poly_degree, RandomSample.sample_triangle(this.poly_degree));
            // random_vec.coeffs = [1, -1, 1, -1, 0, -1, -1, 0];
            // console.log("Random vec: ", random_vec.coeffs);

            let error1 = new Polynomial(this.poly_degree, RandomSample.sample_triangle(this.poly_degree));
            // console.log("Error 1: ", error1.coeffs)
            // error1 = new Polynomial(this.poly_degree, new Array(this.poly_degree).fill(0)); //TODO: Not sure why error1 is re-declared with empty array
            // console.log("Error 1 zeros: ", error1.coeffs)
            let error2 = new Polynomial(this.poly_degree, RandomSample.sample_triangle(this.poly_degree));
            // console.log("Error 2: ", error2.coeffs);
            // error2 = new Polynomial(this.poly_degree, new Array(this.poly_degree).fill(0)); //TODO: Not sure why error2 is re-declared with empty array
            // console.log("Error 2 zero: ", error2.coeffs);

            let c0 = error1.add(p0.multiply(random_vec, this.coeff_modulus), this.coeff_modulus).add(scaled_message, this.coeff_modulus);
            // let c0 = p0.multiply(random_vec, this.coeff_modulus, "from_encrypt");
            // console.log("After multiply C0: ", c0.coeffs);
            // c0 = error1.add(c0, this.coeff_modulus);
            // console.log("Add error C0: ", c0.coeffs);
            // c0 = c0.add(scaled_message, this.coeff_modulus);
            // console.log("Final C0: ", c0.coeffs);
            let c1 = error2.add(p1.multiply(random_vec, this.coeff_modulus), this.coeff_modulus);
            // let c1 = p1.multiply(random_vec, this.coeff_modulus, "from_encrypt");
            // console.log("After mul C1: ", c1.coeffs);
            // c1 = error2.add(c1, this.coeff_modulus);
            // console.log("Final C1: ", c1.coeffs);

            return new Ciphertext(c0, c1);
      }
}

module.exports = BFVEncryptor;