function preload(){
  // put preload code here
}

let stockMSFT = [];
let dataMSFT = [];

let stockPSX = [];
let dataPSX = [];

function setup() {
  // put setup code here
  createCanvas(windowWidth,windowHeight);

  //KEY

  //stock:
  //D1,Beta,LFCF,BVPS,EPS
  ///g(thisyear),g(nextyear),g(5year)

  //data:
  //eps19,eps18,eps17,eps16,eps15
  //bookValue19,bv18,bv17,bv16,bv15
  //shares19,shares18,shares17,shares16,shares15
  //operatingCashFlow19,ocf18,ocf17,ocf16,ocf15
  //capex19,capex18,capex17,capex16,capex15
  //netBorrowing19,b18,b17,b16,b15

  //US
  stockMSFT = [
    [2.04,0.95,36200000000,15.09,6],
    [0.198,0.091,0.1522],
  ];
  dataMSFT = [
    [5.11,2.11,2.74,2.12],
    [102330000000,82718000000,72394000000,71997000000],
    [7673000000,7700000000,7746000000,7925000000],
    [52185000000,43884000000,39507000000,33325000000],
    [-13925000000,-11632000000,-8129000000,-8343000000],
    [-4000000000,-10060000000,-7922000000,-2796000000],
  ];

  stockPSX = [
    [3.6,1.6,335750000,48.94,0.83],
    [-0.708,1.8,-0.06],
  ];

  //CAD
  stockBNS = [
    [3.6,0.87,6340000000,53.62,6.8],
    [-0.115,0.101,0.006],
  ];

  stockRY = [
    [4.32,0.72,19220000000,54.99,9],
    [-0.043,0.053,0.059],
  ];

  stockFNV = [
    [1.42,0.6,203940000,25.67,0.95],
    [0.214,0.113,0.0799],
  ];

  stockITP = [
    [0.83,1.57,65560000,4.2,0.76],
    [-0.112,0.207,0.05],
  ];

  stockBMO = [
    [4.24,1.02,21206000000,74.24,8.75],
    [-0.088,0.062,-0.02],
  ];

  stockMFC = [
    [1.12,1.16,19376000000,26.34,2.33],
    [-0.118,0.16,0.129],
  ];

  stockBCE = [
    [3.33,0.28,2850000000,21.1,3.3],
    [-0.074,0.102,0.0433],
  ];
}

function mousePressed(){
  ddm(stockMSFT);
  dcf(stockMSFT,dataMSFT,0);
  ggf(stockMSFT);
  gn(stockMSFT);
}

function draw() {
  // put drawing code here
}

function ddm(array){
  let i = array[0][1] * 0.058 + 0.003;
  let pv1 = array[0][0]/(1+i);
  let pv2 = (array[0][0]*(1+array[1][2]))/((1+i)*(1+i));
  let pv3 = (array[0][0]*(1+array[1][2])**2)/((1+i)*(1+i)*(1+i));
  let pv4 = (array[0][0]*(1+array[1][2])**3)/((1+i)*(1+i)*(1+i)*(1+i));
  let pv5 = (array[0][0]*(1+array[1][2])**4)/((1+i)*(1+i)*(1+i)*(1+i)*(1+i));
  let terminal = (array[0][0]*(1+array[1][2])**4)/(i-0.01);
  terminal = terminal/((1+i)*(1+i)*(1+i)*(1+i)*(1+i));
  let value = pv1+pv2+pv3+pv4+pv5+terminal;
  console.log(value);
  value = int(value);
  textSize(40);
  text("DDM",300,100);
  text(str(value),300,200);
}

function dcf(stock,data,yearPOS){
  let i = stock[0][1] * 0.058 + 0.003;
  let fcfe = data[3][yearPOS] + data[4][yearPOS] + data[5][yearPOS];
  fcfe = fcfe * (1+stock[1][0]);
  let pv1 = fcfe/(1+i);
  let pv2 = (fcfe*(1+stock[1][2]))/(1+i)*(1+i);
  let pv3 = (fcfe*(1+stock[1][2])**2)/(1+i)*(1+i)*(1+i);
  let pv4 = (fcfe*(1+stock[1][2])**3)/(1+i)*(1+i)*(1+i)*(1+i);
  let pv5 = (fcfe*(1+stock[1][2])**4)/(1+i)*(1+i)*(1+i)*(1+i)*(1+i);
  let terminal = ((fcfe*(1+stock[1][2])**4)*1.01)/(i-0.01);
  terminal = terminal/(1+i)*(1+i)*(1+i)*(1+i)*(1+i);
  let value = pv1+pv2+pv3+pv4+pv5+terminal;
  value = value/data[2][yearPOS];
  console.log(value);
  value = int(value);
  textSize(40);
  text("DCF",600,100);
  text(str(value),600,200);
}

function ggf(stock){
  let value = (stock[0][4])*(8.5+2*stock[1][2]*100);
  console.log(value);
  value = int(value);
  textSize(40);
  text("GGF",900,100);
  text(str(value),900,200);
}

function gn(stock){
  let value = sqrt(22.5*stock[0][3]*stock[0][4]);
  console.log(value);
  value = int(value);
  textSize(40);
  text("GN",1200,100);
  text(str(value),1200,200);
}
