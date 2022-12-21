const Polynomial = require('./util/polynomial.js');

class IntegerEncoder {
      constructor(params, base=2) {
            this.base = base;
            this.poly_degree = params.poly_degree;
      }

      encode(value) {
            let coeffs = new Array(this.poly_degree).fill(0);
            let i = 0;
            while(value >= 1) {
                  coeffs[i] = parseInt(((value % this.base) + this.base) % this.base);
                  value = value / this.base;
                  i = i + 1;
            }
            return new Polynomial(this.poly_degree, coeffs);
      }

      decode(plain_poly) {
            let value = 0;
            let power = 1;
            for(let i=0; i<this.poly_degree; i++){
                  value = value + (plain_poly.poly.coeffs[i] * power); //TODO: verify the plain_poly structure once decryption is done
                  power = power * this.base;
            }
            return value;
      }
}

module.exports = IntegerEncoder