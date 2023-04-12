const FFTContext = require('./fft.js');
const ComplexCalc = require('./complex_calc.js');
const Complex = require('./complex.js');
const BigNumber = require('bignumber.js'); 

class Polynomial {
      constructor(poly_degree, coeffs) {
            this.poly_degree = poly_degree;
            this.coeffs = coeffs;
      }   
      
      add(poly, coeff_modulus) {
            let sum = new Polynomial(this.poly_degree, new Array(this.poly_degree).fill(0));
            for(let i=0; i<this.poly_degree; i++){
                  if(BigNumber.isBigNumber(this.coeffs[i]))
                        sum.coeffs[i] = this.coeffs[i].plus(poly.coeffs[i]);
                  else if (BigNumber.isBigNumber(poly.coeffs[i]))
                        sum.coeffs[i] = poly.coeffs[i].plus(this.coeffs[i]);      
                  else
                        sum.coeffs[i] = this.coeffs[i] + poly.coeffs[i];
            }
            if(arguments.length > 1){
                  sum = sum.mod(coeff_modulus)
            }
            return sum;
      }

      multiply(poly, coeff_modulus) {
            let mul = new Polynomial(this.poly_degree, new Array(this.poly_degree).fill(0));
            for(let d=0; d<(2*this.poly_degree)-1; d++){
                  let index = ((d % this.poly_degree) + this.poly_degree) % this.poly_degree;
                  let sign = 0;
                  if(d<this.poly_degree)
                        sign = 1;
                  else
                        sign = -1;
                  
                  let coeff = 0;
                  for(let i=0; i<this.poly_degree; i++){
                        if((d-i)>=0 && (d-i)<this.poly_degree)
                              if (((new BigNumber(coeff)).plus((new BigNumber(this.coeffs[i])).multipliedBy(poly.coeffs[d-i]))).isGreaterThanOrEqualTo(Number.MAX_SAFE_INTEGER))
                                    coeff = (new BigNumber(coeff)).plus((new BigNumber(this.coeffs[i])).multipliedBy(poly.coeffs[d-i]));
                              else
                                    coeff = coeff + this.coeffs[i] * poly.coeffs[d-i];
                  }
                  if (BigNumber.isBigNumber(coeff))
                        mul.coeffs[index] = (new BigNumber(mul.coeffs[index])).plus(coeff.multipliedBy(sign));
                  else
                        mul.coeffs[index] = mul.coeffs[index] + (sign * coeff);
                  if(arguments.length > 1) {
                        if (BigNumber.isBigNumber(mul.coeffs[index]))
                              mul.coeffs[index] = ((mul.coeffs[index]).mod(coeff_modulus)).toNumber();
                        else
                              mul.coeffs[index] = ((mul.coeffs[index] % coeff_modulus) + coeff_modulus) % coeff_modulus;
                  }
            }
            return mul;                  
      }

      scalar_multiply(scalar, coeff_modulus) {
            let new_coeffs = new Array(this.poly_degree).fill(0);
            if(arguments.length == 1)
                  for(let i=0; i<this.poly_degree; i++){
                        if (BigNumber.isBigNumber(this.coeffs[i])){
                              new_coeffs[i] = (this.coeffs[i]).multipliedBy(scalar);                        
                        }
                        else
                              new_coeffs[i] = this.coeffs[i] * scalar;
                  }
            else
                  for(let i=0; i<this.poly_degree; i++){
                        if (((new BigNumber(this.coeffs[i])).multipliedBy(scalar)).isGreaterThanOrEqualTo(Number.MAX_SAFE_INTEGER))
                              new_coeffs[i] = (((new BigNumber(this.coeffs[i])).multipliedBy(scalar))).mod(coeff_modulus);
                        else
                              new_coeffs[i] = (((this.coeffs[i] * scalar) % coeff_modulus) + coeff_modulus) % coeff_modulus;
                  }
            return new Polynomial(this.poly_degree, new_coeffs);
      }

      mod(coeff_modulus) {
            let new_coeffs = new Array(this.poly_degree).fill(0);
            for(let i=0; i<this.poly_degree; i++)
                  new_coeffs[i] = ((this.coeffs[i] % coeff_modulus) + coeff_modulus) % coeff_modulus;
            return new Polynomial(this.poly_degree, new_coeffs);
      }

      round() {
            let new_coeffs = new Array(this.poly_degree).fill(0);
            for(let i=0;i<this.poly_degree;i++){
                  if (this.coeffs[i] instanceof Complex)
                        if ((new BigNumber(this.coeffs[i].real)).e > 0)
                              new_coeffs[i] = new BigNumber(BigInt(this.coeffs[i].real));
                        else
                              new_coeffs[i] = Math.round(this.coeffs[i].real);
                  else
                        if (BigNumber.isBigNumber(this.coeffs[i]))
                              new_coeffs[i] = this.coeffs[i].integerValue();
                        else
                              new_coeffs[i] = Math.round(this.coeffs[i]);
            }
            return new Polynomial(this.poly_degree, new_coeffs)
      }

      multiply_fft(poly) {
            let fft = new FFTContext(this.poly_degree * 8);
            let a = fft.fft_fwd(this.coeffs.concat(new Array(this.poly_degree).fill(0)));
            let b = fft.fft_fwd(poly.coeffs.concat(new Array(this.poly_degree).fill(0)));
            let ab = new Array(this.poly_degree * 2).fill(0);
            for(let i=0; i< this.poly_degree * 2; i++) {
                  ab[i] = ComplexCalc.complex_mul(a[i], b[i]);
            }

            let prod = fft.fft_inv(ab);
            let poly_prod = new Array(this.poly_degree).fill(0);

            for(let d=0; d<(2*this.poly_degree-1); d++) {
                  let index = ((d % this.poly_degree) + this.poly_degree) % this.poly_degree;
                  let sign = 0;
                  if(d<this.poly_degree)
                        sign = 1;
                  else
                        sign = -1;
                  
                  poly_prod[index] = ComplexCalc.complex_add(poly_prod[index], ComplexCalc.complex_mul(sign, prod[d]));
            }

            return new Polynomial(this.poly_degree, poly_prod).round();
      }

      base_decompose(base, num_levels) {
            let decomposed = new Array(num_levels);
            for (let i=0; i<num_levels; i++)
                  decomposed[i] = new Polynomial(this.poly_degree, new Array(this.poly_degree).fill(0));
            let poly = this;

            for(let i=0; i<num_levels; i++) {
                  decomposed[i] = poly.mod(base);
                  poly = poly.scalar_multiply(1/base).floor();
            }

            return decomposed;
      }

      floor() {
            let new_coeffs = new Array(this.coeffs.length).fill(0);
            for(let i=0; i<this.coeffs.length; i++) 
                  new_coeffs[i] = parseInt(this.coeffs[i]);
            
            return new Polynomial(this.poly_degree, new_coeffs);
      }
}

module.exports = Polynomial