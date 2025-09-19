import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { ProductList, ProductEdit, ProductCreate } from './admin/products';
import { UserList, UserEdit } from './admin/users';
import { CategoryList, CategoryEdit, CategoryCreate } from './admin/categories';
import { PartnerList, PartnerEdit, PartnerCreate } from './admin/partners';
import { ClientList, ClientEdit, ClientCreate } from './admin/clients';
import { PostList, PostEdit, PostCreate } from './admin/posts';
import { PostCategoryList, PostCategoryEdit, PostCategoryCreate } from './admin/postCategories';
import { RatingList, RatingEdit } from './admin/ratings';
import { PromotionList, PromotionEdit, PromotionCreate } from './admin/promotions';
import { OrderList, OrderEdit } from './admin/orders';
import { CartList } from './admin/carts';
import { userLogin, getUserInfo } from "../src/api/api";
import { PositionCreate, PositionEdit, PositionList } from './admin/positions';
import { RecruitEdit, RecruitList } from './admin/recruits';
import { AboutCreate, AboutEdit, AboutList } from './admin/about';

// Dùng jsonServerProvider cho các phương thức không có file upload
const dataProvider = jsonServerProvider(`${process.env.REACT_APP_BACKEND_URL}/api`);

const customDataProvider = {
  ...dataProvider,

  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const start = (page - 1) * perPage;
    const end = page * perPage;

    const query = {
      _sort: field,
      _order: order,
      _start: start,
      _end: end,
      ...params.filter,
    };

    const url = `${process.env.REACT_APP_BACKEND_URL}/api/${resource}?${new URLSearchParams(query)}`;

    const response = await fetch(url);
    const data = await response.json();

    return {
      data,
      total: parseInt(response.headers.get('X-Total-Count'), 10),
    }
  },

  create: async (resource, params) => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/${resource}`;
    const formData = new FormData();

    if (resource === 'users' || resource === 'categories' || resource === 'clients' || resource === 'partners'
      || resource === 'posts' || resource === 'about') {
      Object.entries(params.data).forEach(([key, value]) => {
        if (['image', 'logo', 'bannerSideLeftBar'].includes(key) && value?.rawFile) {
          formData.append(key, value.rawFile);
        } else if (Array.isArray(value)) {
          // Nếu là mảng thì append từng phần tử
          value.forEach(v => formData.append(`${key}[]`, v));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) return { data };
      throw new Error(data.message || 'Create failed');
    } else if (resource === 'products') {
      const newImages = [];

      // Ảnh của sản phẩm
      (params.data.images || []).forEach((image) => {
        if (image?.rawFile) newImages.push(image.rawFile);
      });
      newImages.forEach((file) => {
        formData.append('images', file);
      });

      // Xử lý variants
      if (Array.isArray(params.data.variants)) {
        const processedVariants = params.data.variants.map((variant, index) => {
          const variantCopy = { ...variant };

          // Tách ảnh mới của variant
          if (variant.images && Array.isArray(variant.images)) {
            variant.images.forEach((image) => {
              if (image?.rawFile) {
                formData.append(`variantImages_${index}`, image.rawFile);
              } else if (typeof image === 'string') {
                // ảnh cũ giữ nguyên
              }
            });
          }

          return variantCopy;
        });

        // Lưu variants dạng JSON string để server parse
        formData.append('variants', JSON.stringify(processedVariants));
      }

      // Append các field còn lại
      Object.keys(params.data).forEach((key) => {
        if (key !== 'images' && key !== 'variants') {
          formData.append(key, params.data[key]);
        }
      });

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        return { data: { ...data, id: data._id || data.id } };
      } else {
        throw new Error(data.message || 'Create failed');
      }
    }
    else {
      return dataProvider.create(resource, params);
    }
  },

  update: async (resource, params) => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/${resource}/${params.id}`;
    const formData = new FormData();

    if (resource === 'users' || resource === 'categories' || resource === 'clients' || resource === 'partners'
      || resource === 'posts' || resource === 'about') {
      Object.entries(params.data).forEach(([key, value]) => {
        if (['image', 'logo', 'bannerSideLeftBar'].includes(key) && value?.rawFile) {
          formData.append(key, value.rawFile);
        } else if (Array.isArray(value)) {
          // Nếu là mảng thì append từng phần tử
          value.forEach(v => formData.append(`${key}[]`, v));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      const response = await fetch(url, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        return { data: { ...data, id: data._id || data.id } };
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } else if (resource === 'products' || resource === 'ratings') {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/${resource}/${params.id}`;
      const formData = new FormData();

      // ----- Xử lý ảnh sản phẩm chính -----
      const existingImages = [];
      const newImages = [];

      (params.data.images || []).forEach((image) => {
        if (typeof image === 'string') {
          existingImages.push(image);
        } else if (image?.rawFile) {
          newImages.push(image.rawFile);
        }
      });

      formData.append('existingImages', JSON.stringify(existingImages));
      newImages.forEach((file) => {
        formData.append('newImages', file);
      });
      if (resource === 'products') {
        // ----- Xử lý variants -----
        const variants = (params.data.variants || []).map((variant, index) => {
          const existingVariantImages = [];
          const newVariantImages = [];

          (variant.images || []).forEach((img) => {
            if (typeof img === 'string') {
              existingVariantImages.push(img);
            } else if (img?.rawFile) {
              newVariantImages.push(img.rawFile);
            }
          });

          // Gửi ảnh mới vào đúng field: variants[0]._newImages
          newVariantImages.forEach((file) => {
            formData.append(`variants[${index}]._newImages`, file);
          });

          // Trả lại variant JSON (chỉ giữ link ảnh cũ)
          return {
            ...variant,
            images: existingVariantImages
          };
        });

        // Gửi toàn bộ variants dạng JSON string
        formData.append('variants', JSON.stringify(variants));
      }
      // ----- Append các field khác -----
      Object.keys(params.data).forEach((key) => {
        if (key !== 'images' && key !== 'variants') {
          formData.append(key, params.data[key]);
        }
      });

      // ----- Gửi request -----
      const response = await fetch(url, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        return { data: { ...data, id: data._id || data.id } };
      } else {
        throw new Error(data.message || 'Update failed');
      }
    }
    else {
      return dataProvider.update(resource, params);
    }
  }
};



const authProvider = {
  login: async ({ username, password }) => {
    try {
      const res = await userLogin({ email: username, password });

      // chỉ cho phép role admin
      if (res.role !== "admin") {
        throw new Error("Bạn không có quyền truy cập trang quản trị!");
      }
      return Promise.resolve();
    } catch (error) {
      if (error.response) {
        // lỗi từ backend
        throw new Error(error.response.data.message || "Đăng nhập thất bại!");
      } else {
        // lỗi do frontend tự throw
        throw new Error(error.message);
      }
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role === "admin") {
      return Promise.resolve();
    }
    return Promise.reject("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
  },


  checkError: (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      return Promise.reject("Bạn không có quyền hoặc phiên đăng nhập không hợp lệ!");
    }
    return Promise.resolve();
  },


  getIdentity: async () => {
    try {
      const data = await getUserInfo();
      return {
        id: data.id,
        fullName: data.username,
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Lỗi khi lấy thông tin quản trị viên!"
      );
    }
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    return Promise.resolve();
  },

  getPermissions: async () => {
    return Promise.resolve();
  },
};



const App = () => {
  return (
    <Admin
      basename=""
      dataProvider={customDataProvider}
      authProvider={authProvider}
    >
      <Resource name="about" list={AboutList} edit={AboutEdit} create={AboutCreate} options={{ label: 'Thông tin doanh nghiệp' }} />
      <Resource name="categories" list={CategoryList} edit={CategoryEdit} create={CategoryCreate} options={{ label: 'Danh mục sản phẩm' }} />
      <Resource name="products" list={ProductList} edit={ProductEdit} create={ProductCreate} options={{ label: 'Sản phẩm' }} />
      <Resource name="users" list={UserList} edit={UserEdit} options={{ label: 'Tài khoản' }} />
      <Resource name="clients" list={ClientList} edit={ClientEdit} create={ClientCreate} options={{ label: 'Logo khách hàng' }} />
      <Resource name="partners" list={PartnerList} edit={PartnerEdit} create={PartnerCreate} options={{ label: 'Logo đối tác' }} />
      <Resource name="postCategories" list={PostCategoryList} edit={PostCategoryEdit} create={PostCategoryCreate} options={{ label: 'Danh mục bài viết' }} />
      <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} options={{ label: 'Bài viết' }} />
      <Resource name="ratings" list={RatingList} edit={RatingEdit} options={{ label: 'Đánh giá' }} />
      <Resource name="promotions" list={PromotionList} edit={PromotionEdit} create={PromotionCreate} options={{ label: 'Khuyến mãi' }} />
      <Resource name="carts" list={CartList} options={{ label: 'Giỏ hàng' }} />
      <Resource name="orders" list={OrderList} edit={OrderEdit} options={{ label: 'Đơn hàng' }} />
      <Resource name="positions" list={PositionList} edit={PositionEdit} create={PositionCreate} options={{ label: 'Tuyển dụng' }} />
      <Resource name="recruits" list={RecruitList} edit={RecruitEdit} options={{ label: 'Ứng viên' }} />
    </Admin>
  );
};

export default App;
