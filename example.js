/* eslint-disable no-useless-escape */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const Restaurant = require('./models/Restaurant');
const RestaurantType = require('./models/RestaurantType');
const FoodType = require('./models/FoodType');
const Comment = require('./models/Comment');
const User = require('./models/User');
const Star = require('./models/Star');
const Food = require('./models/Food');
const Response = require('./helpers/response.helper');

function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' ',
  );
  return str;
}

function chuanHoa(str) {
  str = removeVietnameseTones(str);
  // Bỏ khoảng trống giữa các từ
  str = str
    .split(' ')
    .filter((kyTu) => kyTu !== ' ')
    .join('');
  return str[0].toLowerCase() + str.slice(1);
}

exports.chuanHoa = chuanHoa;

// const restaurant = {
//   tenNhaHang: '',
//   name: '',
//   email: '',
//   password: '',
//   isVerified: true,
//   SDT: '',
//   loaiHinh: '',
// };

// console.log(restaurant);

// Thêm nhà hàng
exports.add = async ({
  tenNhaHang,
  name,
  email,
  password,
  SDT,
  loaiHinh,
  diaChi,
  toaDo, // { x: , y: }
}) => {
  const restaurantType = await RestaurantType.findById(loaiHinh);

  // Tạo ra salt mã hóa
  const salt = await bcrypt.genSalt(10);

  const restaurant = await Restaurant.create({
    tenNhaHang,
    name,
    email,
    diaChi,
    SDT,
    password: await bcrypt.hash(password, salt),
    loaiHinh: restaurantType._id,
    isVerified: true,
    toaDo,
  });

  console.log(restaurant);
};

// Thêm loại nhà hàng
// add1('Quán Coffee');

// Thêm dữ liệu nhà hàng
exports.add4 = async () => {
  await this.add5('Nhà hàng');
  await this.add5('Quán ăn');
  await this.add5('Quán Coffee');
  await this.add5('Shop Online');
  await this.add5('Bakery');

  const datas = [
    // {
    //   tenNhaHang: 'congCaPhe',
    //   name: 'Cộng Cà Phê - Lý Tự Trọng',
    //   // email: '',
    //   diaChi: '23 Lý Tự Trọng, Quận Hải Châu, Đà Nẵng',
    //   SDT: '0968971926',
    //   password: '12345678',
    //   loaiHinh: 'Quán Coffee',
    //   isVerified: true,
    //   toaDo: { x: 16.077195, y: 108.2177563 },
    // },
    {
      // tenNhaHang: 'aroiDessertCafeBachDang',
      name: 'Aroi Dessert Cafe - Bạch Đằng',
      // email: '',
      diaChi: '124 Bạch Đằng, Quận Hải Châu, Đà Nẵng',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Quán Coffee',
      isVerified: true,
      toaDo: { x: 16.0677378, y: 108.2225952 },
    },
    {
      // tenNhaHang: 'quanAnPhuongMap',
      name: 'Quán Ăn Phương Mập',
      // email: '',
      diaChi: '14 An Nhơn 9, P. Mỹ An, Quận Sơn Trà, Đà Nẵng',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Shop Online',
      isVerified: true,
      toaDo: { x: 16.0680337, y: 108.2319929 },
    },
    {
      // tenNhaHang: 'bunChaBaBeoPhamVanNghi',
      name: 'Bún Chả Bà Béo - Phạm Văn Nghị',
      // email: '',
      diaChi: 'K10/5 Phạm Văn Nghị, Quận Thanh Khê, Đà Nẵng',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Quán ăn',
      isVerified: true,
      toaDo: { x: 16.0591022, y: 108.2074973 },
    },
    {
      // tenNhaHang: 'milanoDollyCoffeeYenBai',
      name: 'Milano Dolly Coffee - Yên Bái',
      // email: '',
      diaChi: '140 Yên Bái, Quận Hải Châu, Đà Nẵng',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Quán Coffee',
      isVerified: true,
      toaDo: { x: 16.064185, y: 108.2199264 },
    },
    {
      // tenNhaHang: 'lamChickenComGaKieuNhatNguyenVanThoai',
      name: 'Lâm Chicken - Cơm Gà Kiểu Nhật - Nguyễn Văn Thoại',
      // email: '',
      diaChi: '83 Nguyễn Văn Thoại, Quận Ngũ Hành Sơn, Đà Nẵng',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Quán ăn',
      isVerified: true,
      toaDo: { x: 16.0542522, y: 108.2366944 },
    },
    {
      // tenNhaHang: 'gaRanPopeyesLeDuan',
      name: 'Gà Rán Popeyes - Lê Duẩn',
      // email: '',
      diaChi: '86 Lê Duẩn, P. Thạch Thang, Quận Hải Châu, Đà Nẵng',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Quán ăn',
      isVerified: true,
      toaDo: { x: 16.071106, y: 108.214954 },
    },
    {
      // tenNhaHang: 'traSuaOchaHouseNgoVanSo',
      name: 'Trà Sữa Ocha House - Ngô Văn Sở',
      // email: '',
      diaChi: '49 Ngô Văn Sở, Quận Liên Chiểu, Đà Nẵng',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Quán Coffee',
      isVerified: true,
      toaDo: { x: 16.068447, y: 108.1478199 },
    },
    {
      // tenNhaHang: 'traSuaOchaHouseNgoVanSo',
      name: 'Bánh Mì Bảo Tiên',
      // email: '',
      diaChi: '93 Hải Hồ, Quận Hải Châu, Đà Nẵng',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Quán ăn',
      isVerified: true,
      toaDo: { x: 16.0817774, y: 108.2141463 },
    },
    {
      // tenNhaHang: 'traSuaOchaHouseNgoVanSo',
      name: 'Anh Quân Bakery - Trần Nhân Tông',
      // email: '',
      diaChi: '144 Trần Nhân Tông, Quận Sơn Trà, Đà Nẵng',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Bakery',
      isVerified: true,
      toaDo: { x: 16.0882632, y: 108.2358174 },
    },
    {
      // tenNhaHang: 'traSuaOchaHouseNgoVanSo',
      name: 'My Thái Restaurant - Ẩm Thực Thái',
      // email: '',
      diaChi: '389 Trần Hưng Đạo, Quận Sơn Trà',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Nhà hàng',
      isVerified: true,
      toaDo: { x: 16.0663849, y: 108.2275053 },
    },
    {
      // tenNhaHang: 'traSuaOchaHouseNgoVanSo',
      name: 'Dana Buffet',
      // email: '',
      diaChi: '56 Nguyễn Chí Thanh, Quận Hải Châu',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Nhà hàng',
      isVerified: true,
      toaDo: { x: 16.0742981, y: 108.2183214 },
    },
    {
      // tenNhaHang: 'traSuaOchaHouseNgoVanSo',
      name: 'Mama Hot Pot - Yên Bái',
      // email: '',
      diaChi: '89 Yên Bái, Quận Hải Châu',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Nhà hàng',
      isVerified: true,
      toaDo: { x: 16.064492, y: 108.2201339 },
    },
    {
      // tenNhaHang: 'traSuaOchaHouseNgoVanSo',
      name: 'C.Tao - Chinese Restaurant - Đường 2 Tháng 9',
      // email: '',
      diaChi:
        'Lô A15-A16, Khu B3-1, Đường 2 Tháng 9, P. Bình Hiên, Quận Hải Châu',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Nhà hàng',
      isVerified: true,
      toaDo: { x: 16.0326265, y: 108.2223372 },
    },
    {
      // tenNhaHang: 'traSuaOchaHouseNgoVanSo',
      name: 'Mama Hotpot Buffet',
      // email: '',
      diaChi: '75 Hoàng Văn Thụ, P. Phước Ninh, Quận Hải Châu',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Nhà hàng',
      isVerified: true,
      toaDo: { x: 16.0627375, y: 108.2187189 },
    },
    {
      // tenNhaHang: 'traSuaOchaHouseNgoVanSo',
      name: 'Son Tra Retreat - Garden Lounge & Eatery',
      // email: '',
      diaChi: '11 Lê Văn Lương, P. Thọ Quang, Quận Sơn Trà',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Nhà hàng',
      isVerified: true,
      toaDo: { x: 16.10374, y: 108.2619581 },
    },
    {
      // tenNhaHang: 'traSuaOchaHouseNgoVanSo',
      name: 'Bolshevik - Nướng Bơ Phong Cách Hà Nội',
      // email: '',
      diaChi: '8 Bình Minh 1, P. Bình Thuận, Quận Hải Châu',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Nhà hàng',
      isVerified: true,
      toaDo: { x: 16.0551578, y: 108.2193379 },
    },
    {
      // tenNhaHang: 'traSuaOchaHouseNgoVanSo',
      name: 'Đầy N Day - Pizza & Hamburger',
      // email: '',
      diaChi: '03 Hoàng Văn Thụ, Quận Hải Châu',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Nhà hàng',
      isVerified: true,
      toaDo: { x: 16.0625348, y: 108.2207033 },
    },
    {
      // tenNhaHang: 'traSuaOchaHouseNgoVanSo',
      name: 'Dasushi - Ăn Nhậu Kiểu Nhật',
      // email: '',
      diaChi: '266 - 268 Nguyễn Văn Linh, Quận Thanh Khê',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Nhà hàng',
      isVerified: true,
      toaDo: { x: 16.05919, y: 108.2048899 },
    },
    {
      // tenNhaHang: 'traSuaOchaHouseNgoVanSo',
      name: 'Nhà Hàng Thái Aroy',
      // email: '',
      diaChi: 'Lô 15 Nguyễn Sinh Sắc, Quận Liên Chiểu',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Nhà hàng',
      isVerified: true,
      toaDo: { x: 16.0724604, y: 108.1575758 },
    },
    {
      // tenNhaHang: 'traSuaOchaHouseNgoVanSo',
      name: '420 Coffee And Pub',
      // email: '',
      diaChi: 'K3/12 Phan Thành Tài, Quận Hải Châu',
      SDT: '0968971926',
      password: '12345678',
      loaiHinh: 'Quán Coffee',
      isVerified: true,
      toaDo: { x: 16.05295, y: 108.2193058 },
    },
  ];

  let index = 2;

  for (const data of datas) {
    const restaurantType = await RestaurantType.findOne({
      name: data.loaiHinh,
    });

    if (!restaurantType) return console.log('Có lỗi xảy ra');

    await this.add({
      ...data,
      tenNhaHang: chuanHoa(data.name),
      email: `duongvanthien${index++}@gmail.com`,
      loaiHinh: restaurantType._id,
    });
  }

  return console.log('Xong');
};

// Thêm loại thức ăn
exports.add1 = async (req, res) => {
  const { tenLoai } = req.body;
  try {
    await FoodType.create({ tenLoai });
    return Response.success(res, { message: 'Thêm loại thức ăn thành công' });
  } catch (error) {
    return console.log(error);
  }
};

// Thêm comment
exports.add2 = async (text, userId, restaurantId) => {
  const user = await User.findById(userId);
  const restaurant = await Restaurant.findById(restaurantId);

  await Comment.create({
    chiTiet: text,
    nhaHang: restaurant._id,
    khachHang: user._id,
  });
};

// Thêm đánh giá
exports.add3 = async (soLuong, userId, restaurantId) => {
  const user = await User.findById(userId);
  const restaurant = await Restaurant.findById(restaurantId);

  await Star.create({
    soLuong,
    nhaHang: restaurant._id,
    khachHang: user._id,
  });
};

// Thêm loại nhà hàng
exports.add5 = async (name) => {
  await RestaurantType.create({
    name,
  });

  console.log('Thêm loại nhà hàng thành công');
};

const limit = 20;

exports.getMonExample = async (req, res) => {
  let {
    query: { q },
  } = req;
  try {
    q = parseInt(q, 10);
    const totals = await Food.find().count();
    const foods = await Food.find()
      .populate('loai')
      .populate('nhaHang')
      .skip((q - 1) * limit)
      .limit(limit);

    if (!foods) throw new Error('Có lỗi xảy ra');
    return Response.success(res, { totals, foods });
  } catch (error) {
    console.log(error);
    return Response.error(res, error);
  }
};

exports.updateValidateUser = async (req, res) => {
  const {
    params: { userId },
  } = req;

  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('Có lỗi xảy ra');
    await User.findByIdAndUpdate(userId, {
      $set: { isVerified: !user.isVerified },
    });
    return Response.success(res, { message: 'Cập nhật thành công' });
  } catch (error) {
    return console.log(error.message);
  }
};

// add(
//   'Bún Bò Hiến Hằng',
//   'bunBoHienHang',
//   'duongvanthien1@.gmail.com',
//   '12345678',
//   '0968971926',
//   'Quán ăn',
//   '172 Núi Thành, Quận Hải Châu, Đà Nẵng',
// );
