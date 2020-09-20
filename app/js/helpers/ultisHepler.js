const formatNumber = (x) =>
{
  x = x.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
  return x
};

export default {
  formatNumber
};