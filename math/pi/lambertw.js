/** from https://github.com/protobi/lambertw/blob/master/lambertw.js */
const GSL_DBL_EPSILON = 2.2204460492503131e-16;
const one_over_E = 1 / Math.E;

function halley_iteration(x, w_initial, max_iters) {
  var w = w_initial, i;

  var result = {};

  for (i = 0; i < max_iters; i++) {
    var tol;
    var e = Math.exp(w);
    var p = w + 1.0;
    var t = w * e - x;

    if (w > 0) {
      t = (t / p) / e;
      /* Newton iteration */
    } else {
      t /= e * p - 0.5 * (p + 1.0) * t / p;
      /* Halley iteration */
    }

    w -= t;

    tol = GSL_DBL_EPSILON * Math.max(Math.abs(w), 1.0 / (Math.abs(p) * e));

    if (Math.abs(t) < tol) {
      return {
        val: w,
        err: 2.0 * tol,
        iters: i,
        success: true
      }
    }
  }
  /* should never get here */

  return {
    val: w,
    err: Math.abs(w),
    iters: i,
    success: false
  }
}
function gsl_sf_lambert_W0(x) {
  const one_over_E = 1.0 / Math.E;
  const q = x + one_over_E;

  var result = {};

  if (x == 0.0) {
    result.val = 0.0;
    result.err = 0.0;
    result.success = true;
    return result;
  }
  else if (q < 0.0) {
    /* Strictly speaking this is an error. But because of the
     * arithmetic operation connecting x and q, I am a little
     * lenient in case of some epsilon overshoot. The following
     * answer is quite accurate in that case. Anyway, we have
     * to return GSL_EDOM.
     */
    result.val = -1.0;
    result.err = Math.sqrt(-q);
    result.success = false; // GSL_EDOM
    return result;
  }
  else if (q == 0.0) {
    result.val = -1.0;
    result.err = GSL_DBL_EPSILON;
    /* cannot error is zero, maybe q == 0 by "accident" */
    result.success = true;
    return result;
  }
  else if (q < 1.0e-03) {
    /* series near -1/E in sqrt(q) */
    const r = Math.sqrt(q);
    result.val = series_eval(r);
    result.err = 2.0 * GSL_DBL_EPSILON * Math.abs(result.val);
    result.success = true;
    return result;
  }
  else {
    const MAX_ITERS = 100;
    var w;

    if (x < 1.0) {
      /* obtain initial approximation from series near x=0;
       * no need for extra care, since the Halley iteration
       * converges nicely on this branch
       */
      const p = Math.sqrt(2.0 * Math.E * q);
      w = -1.0 + p * (1.0 + p * (-1.0 / 3.0 + p * 11.0 / 72.0));
    }
    else {
      /* obtain initial approximation from rough asymptotic */
      w = Math.log(x);
      if (x > 3.0) w -= Math.log(w);
    }

    return halley_iteration(x, w, MAX_ITERS, result).val;
  }
}