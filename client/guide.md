Chào bạn, đây là bản mô tả chi tiết về cấu trúc, tổ chức và các quy tắc code của dự án frontend này, được thiết kế để hướng dẫn một AI khác có thể tuân theo và phát triển một dự án mới với kiến trúc tương tự.

---

## 1. Tổng quan Công nghệ (Tech Stack)

Dự án này là một ứng dụng React được xây dựng với **TypeScript** và **Vite**. Kiến trúc của nó tập trung mạnh vào việc chia tách rõ ràng các mối quan tâm (separation of concerns) và tổ chức theo từng tính năng (feature-sliced).

- **Framework chính:** React 19
- **Build Tool:** Vite
- **Ngôn ngữ:** TypeScript
- **UI Library:** Material-UI (MUI)
- **Routing:** React Router DOM
- **Quản lý Server State:** TanStack React Query
- **Quản lý Global State (Client):** Zustand
- **HTTP Client:** Axios
- **Styling:** Sass (SCSS Modules) và MUI Styled Components (@emotion/styled)

---

## 2. Cấu trúc Thư mục

Kiến trúc cốt lõi của dự án là **Feature-Sliced Design**. Mọi logic nghiệp vụ được đóng gói trong các thư mục "tính năng" (features).
client/
├── public/ # Tài nguyên tĩnh
├── src/
│ ├── assets/ # Fonts, images, styles toàn cục
│ ├── components/ # Components UI chung (Header, Footer, Button...)
│ ├── constants/ # Các hằng số toàn cục (API_PATHS, ROUTE_PATH)
│ ├── features/ # NƠI CHỨA LOGIC NGHIỆP VỤ CHÍNH
│ │ ├── products/ # Ví dụ: tính năng "Sản phẩm"
│ │ │ ├── components/ # Components chỉ dùng cho tính năng Products
│ │ │ ├── constants/ # Hằng số riêng của Products
│ │ │ ├── hooks/ # Hooks riêng của Products
│ │ │ ├── mutations/ # Các hooks useMutation (React Query)
│ │ │ ├── pages/ # Các component trang (VD: ProductsPage)
│ │ │ ├── queries/ # Các hooks useQuery (React Query)
│ │ │ ├── routes/ # Định nghĩa route cho tính năng
│ │ │ ├── services/ # Logic gọi API
│ │ │ └── types/ # Định nghĩa TypeScript types/interfaces
│ │ ├── login/ # Tính năng "Đăng nhập"
│ │ ├── order/ # Tính năng "Đơn hàng"
│ │ └── ... # Các tính năng khác
│ ├── hooks/ # Hooks toàn cục (VD: useUserProfile)
│ ├── layouts/ # Bố cục trang (MainLayout, DashboardLayout)
│ ├── libs/ # Cấu hình thư viện (axios, react-query)
│ ├── routes/ # Nơi tổng hợp các routes từ features
│ ├── store/ # Global state (Zustand)
│ ├── utils/ # Hàm tiện ích chung (error-handler)
│ ├── App.tsx # Component App gốc
│ └── main.tsx # Điểm vào ứng dụng
├── vite.config.ts # Cấu hình Vite (bao gồm path alias)
└── package.json
**Quy tắc:**

1.  **Tổ chức theo tính năng:** Logic nghiệp vụ (API, state, trang, components) phải được đặt trong thư mục `src/features/[feature-name]`.
2.  **Tái sử dụng:**
    - Nếu một component chỉ dùng trong 1 tính năng, đặt nó vào `src/features/[feature-name]/components/`.
    - Nếu một component được dùng ở nhiều nơi (ít nhất 2-3 tính năng), đưa nó lên `src/components/`.
3.  **Path Alias:** Sử dụng alias `@` trỏ đến `src/` để tránh các đường dẫn tương đối phức tạp (`../../`).

---

## 3. Quy tắc Code và Patterns

### 3.1. Quản lý State

Dự án phân tách rõ ràng 2 loại state:

- **Server State (Trạng thái từ Server):**

  - **Công cụ:** TanStack React Query.
  - **Quy tắc:** Mọi hoạt động lấy, cache, hay cập nhật dữ liệu từ API đều phải được thực hiện qua React Query.
  - **Tổ chức:**
    1.  **Query Keys:** Định nghĩa các key một cách có cấu trúc trong `src/features/.../queries/` (ví dụ: `PRODUCT_QUERY_KEYS`).
    2.  **Custom Hooks:** Tạo các custom hook (ví dụ: `useProducts`, `useProduct`) để bọc `useQuery` và `useMutation`. Điều này giúp logic gọi data dễ dàng tái sử dụng và quản lý.
    3.  **Services:** Các hàm `queryFn` trong `useQuery` sẽ gọi các hàm từ thư mục `services/` (xem mục 3.2).

- **Global Client State (Trạng thái Phía Client):**
  - **Công cụ:** Zustand.
  - **Quy tắc:** Chỉ sử dụng Zustand cho các trạng thái toàn cục, không đồng bộ từ server, ví dụ: thông tin người dùng đã đăng nhập, token, trạng thái đóng/mở modal, thông báo (toast).
  - **Tổ chức:** Các "store" được tạo trong `src/store/`. Ví dụ, `auth.store.ts` quản lý token, refresh token và thông tin user.
  - **Persistence:** Sử dụng `persist` middleware của Zustand để lưu state (như auth) vào `localStorage`.

### 3.2. Xử lý API (HTTP Layer)

Đây là một phần quan trọng của kiến trúc, được định nghĩa trong `src/libs/http.libs.ts`.

- **Axios Instance:** Tạo một instance Axios tùy chỉnh (`http`) để dùng chung cho toàn bộ ứng dụng.
- **Request Interceptor:** Tự động đính kèm `Authorization: Bearer <token>` vào header của mọi request, lấy token từ `useAuthStore`.
- **Response Interceptor (Xử lý Refresh Token):**
  1.  Tự động bắt lỗi 401 (Unauthorized).
  2.  Nếu gặp lỗi 401, nó sẽ tạm dừng request hiện tại.
  3.  Sử dụng `refreshToken` (lấy từ `useAuthStore`) để gọi API refresh token (sử dụng một instance `rawHttp` riêng để tránh vòng lặp interceptor).
  4.  Trong khi đang refresh, các request khác đến cũng sẽ bị đưa vào hàng đợi (`failedQueue`).
  5.  Sau khi có `accessToken` mới, nó cập nhật token vào `useAuthStore`, xử lý hàng đợi, và thực hiện lại request ban đầu.
  6.  Nếu refresh thất bại, nó sẽ xóa toàn bộ auth state và điều hướng người dùng về trang đăng nhập.
- **Global Error Handling:** Interceptor cũng hiển thị thông báo lỗi (toast) chung cho các lỗi API khác (như 500, 404), trừ các lỗi 401, 403 (đã được xử lý riêng) và các request là mutation (mutation tự xử lý lỗi).

### 3.3. Cấu trúc Services

Logic gọi API được tách riêng khỏi components và React Query hooks.

- **Pattern:** Sử dụng **Interface (Dependency Inversion)** và **Singleton**.
- **Ví dụ (`product.services.ts`):**
  1.  Định nghĩa một `interface IProductService` mô tả các phương thức.
  2.  Tạo một `class ProductService` triển khai interface này. Các phương thức bên trong class sẽ sử dụng `http` (Axios instance) để gọi API.
  3.  Tạo và export một instance duy nhất (singleton): `export const productService: IProductService = new ProductService()`.
  4.  (Tùy chọn) Export các hàm riêng lẻ để dễ sử dụng trong React Query: `export const getProducts = (params) => productService.getProducts(params)`.

### 3.4. Routing

- **Tổ chức:** Các routes được định nghĩa trong từng feature tại `src/features/.../routes/`.
- **Tổng hợp:** File `src/routes/app.routes.tsx` chịu trách nhiệm import tất cả các đối tượng route từ các feature và tổng hợp chúng lại bằng `useRoutes`.
- **Layouts:** Các routes được lồng bên trong các `Layout` (ví dụ: `MainLayout`). Component layout sẽ chứa `<Outlet />` để render component con tương ứng với route.
- **Code Splitting:** Các component trang (`pages/`) được tải lazy bằng `React.lazy()` ngay tại file route của feature đó, giúp tối ưu hiệu suất tải trang ban đầu.

### 3.5. Quy tắc Đặt tên tệp

Sử dụng hậu tố (suffix) để làm rõ vai trò của tệp:

- Components: `*.components.tsx` (VD: `header.components.tsx`)
- Pages: `*.page.tsx` (VD: `products.page.tsx`)
- Routes: `*.routes.tsx` (VD: `products.routes.tsx`)
- Services: `*.services.ts` (VD: `product.services.ts`)
- Queries: `*.queries.ts` (VD: `product.queries.ts`)
- Store (Zustand): `*.store.ts` (VD: `auth.store.ts`)
- Hooks: `*.hooks.ts` (VD: `use-login.hooks.tsx`)
- Constants: `*.constants.ts` (VD: `api-path.constants.ts`)
- Types: `*.types.ts` (VD: `product.types.ts`)
- Layouts: `*.layouts.tsx` (VD: `main.layouts.tsx`)
- Styles (SCSS): `*.module.scss` (VD: `footer.module.scss`)
