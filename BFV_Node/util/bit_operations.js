var reverse_bits = (value, width) => {
      let bits_arr = value.toString(2).split('');
      bits_arr = bits_arr.reverse();
      let extra_bits = new Array(width-(bits_arr.length)).fill(0);
      let rev_bits_arr = bits_arr.concat(extra_bits);
      let reversed = parseInt(rev_bits_arr.join(''), 2);

      return reversed;
}

var bit_reverse_vec = (values) => {
      let result = new Array(values.length).fill(0);
      for(let i=0; i<values.length; i++) {
            result[i] = values[reverse_bits(i, parseInt(Math.log2(values.length)))];
      }

      return result;
}

module.exports = {reverse_bits, bit_reverse_vec}