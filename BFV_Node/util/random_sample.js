var sample_gauss = (sample_count, std_dev) => {
      // Samples from a gaussian or normal distribution.
      // Using Box-Muller transform
      let gauss_sample = new Array(sample_count).fill(0);
      for(let i=0; i<sample_count; i++){
            let box_muller = Math.sqrt(-2.0 * Math.log(Math.random())) * Math.cos(2.0 * Math.PI * Math.random());
            gauss_sample[i] =  Math.round(box_muller * std_dev);
      }
      return gauss_sample;
}

var sample_triangle = (sample_count) => {
      // Samples from a discrete triangle distribution.

      // Samples num_samples values from [-1, 0, 1] with probabilities
      // [0.25, 0.5, 0.25], respectively.

      // Args:
      //       num_samples (int): Number of samples to be drawn.

      // Returns:
      //       A list of randomly sampled values.

      let sample = new Array(sample_count).fill(0);

      for(let i=0; i<sample_count; i++){
            let random = Math.floor(Math.random() * (3 - 0 + 1) + 0);
            if (random == 0)
                  sample[i] = -1;
            else if (random == 1)
                  sample[i] = 1;
            else  
                  sample[i] = 0;
      }
      return sample;
} 

var sample_uniform = (min_val, max_val, sample_count) => {
      // Samples from a uniform distribution.

      // Samples num_samples integer values from the range [min, max)
      // uniformly at random.

      // Args:
      //       min_val (int): Minimum value (inclusive).
      //       max_val (int): Maximum value (exclusive).
      //       num_samples (int): Number of samples to be drawn.

      // Returns:
      //       A list of randomly sampled values.
    
      if (sample_count == 1)
            return Math.floor(Math.random() * ((max_val-1) - min_val + 1) + min_val);
      
      let uniform_sample = new Array(sample_count).fill(0);
      for(let i=0; i<sample_count; i++)
            uniform_sample[i] =  Math.floor(Math.random() * ((max_val-1) - min_val + 1) + min_val);
      
      return uniform_sample;
}


module.exports = {sample_triangle, sample_uniform, sample_gauss}