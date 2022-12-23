const BitOperation = require('./bit_operations.js');
const Complex = require('./complex.js');
const ComplexCalc = require('./complex_calc.js');
class FFTContext {
      constructor(fft_length) {
            this.fft_length = fft_length;
            this.roots_of_unity = this.precompute_fft()[0];
            this.roots_of_unity_inv = this.precompute_fft()[1];
            this.reversed_bits = this.precompute_fft()[2];
            this.rot_group = this.precompute_fft()[3];
      }

      precompute_fft() {
            let roots_of_unity = new Array(this.fft_length).fill(0);
            let roots_of_unity_inv = new Array(this.fft_length).fill(0);
            
            for(let i=0; i<this.fft_length; i++) {
                  let angle = (2 * Math.PI * i) / this.fft_length;
                  roots_of_unity[i] = new Complex(Math.cos(angle), Math.sin(angle));
                  roots_of_unity_inv[i] = new Complex(Math.cos(-angle), Math.sin(-angle));
            }

            let num_slots = Math.floor(this.fft_length / 4);
            let reversed_bits = new Array(num_slots).fill(0);
            let width = parseInt(Math.log2(num_slots));
            for(let i=0; i<num_slots; i++) {
                  reversed_bits[i] = ((BitOperation.reverse_bits(i, width) % num_slots) + num_slots) % num_slots;
            }

            let rot_group = new Array(num_slots).fill(1);
            for (let i=1; i<num_slots; i++) {
                  rot_group[i] = (((5 * rot_group[i-1]) % this.fft_length) + this.fft_length) % this.fft_length;
            }

            return [roots_of_unity, roots_of_unity_inv, reversed_bits, rot_group];
      }

      fft(coeffs, rou) {
            let num_coeffs = coeffs.length;
            let result = BitOperation.bit_reverse_vec(coeffs);
            let log_num_coeffs = parseInt(Math.log2(num_coeffs));

            let butterfly_plus, butterfly_minus;

            for(let logm=1; logm<= log_num_coeffs; logm++){
                  for(let j=0; j<num_coeffs; j = j + (1 << logm)) {
                        for(let i=0; i<(1 << (logm - 1)); i++) {
                              let index_even = j + i;
                              let index_odd = j + i + (1 << (logm - 1));

                              let rou_index = (i * this.fft_length) >> logm;
                              let omega_factor = ComplexCalc.complex_mul(rou[rou_index], result[index_odd]);


                              butterfly_plus = ComplexCalc.complex_add(result[index_even], omega_factor);
                              butterfly_minus = ComplexCalc.complex_sub(result[index_even], omega_factor);

                              result[index_even] = butterfly_plus;
                              result[index_odd] = butterfly_minus;
                        }
                  }
            }
            return result;
      }

      fft_fwd(coeffs) {
            let fwd = this.fft(coeffs, this.roots_of_unity);
            return fwd;
      }

      fft_inv(coeffs) {
            let num_coeffs = coeffs.length;
            let result = this.fft(coeffs, this.roots_of_unity_inv);
            for(let i=0; i<num_coeffs; i++) {
                  result[i] = ComplexCalc.complex_div(result[i], num_coeffs);
            }

            return result;
      }
}

module.exports = FFTContext;