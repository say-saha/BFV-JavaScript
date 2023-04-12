// Inspired from Jan Breig's thesis
var params_gen = (security_level, msg_bit=64) => {
      let degrees = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
      for (let degree = 0; degree < degrees.length; degree++) {
            let qBits = 0;
            let denominator = (security_level + 140) * degrees[degree];
            let numerator = 1.8 * Math.pow((2*degrees[degree])+msg_bit, 2);
            qBits = Math.floor(numerator/denominator);
            console.log("Degree: ", degrees[degree], "Maximum qBits: ", qBits);
      }
}

// Inspired from Jan Breig's thesis
var security_level = (d, qBits, msg_bit=64) => {
      let numerator = 1.8 * Math.pow(((2*d)+msg_bit), 2);
      let denominator = d * qBits;

      let security_level = ((numerator/denominator) - 140).toFixed(2);

      if (security_level < 1)
            return 0;
      return security_level;
}

let degrees = [16, 32, 64, 128, 256, 512, 1024, 2048]
for(let i=0; i<degrees.length; i++) {
      let sec = security_level(degrees[i], 34, 4);
      console.log("Degree: ", degrees[i], " Security level: ", sec);
}
// params_gen(80, 4);
// console.log(security_level(512, 17, 4))
