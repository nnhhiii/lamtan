import {
    List,
    Datagrid,
    TextField,
    ArrayField,
    NumberField,
    DateField,
    ReferenceField,
    FunctionField,
    SelectInput,
    TextInput,
    ChipField, Edit,
    SimpleForm, BooleanField, SelectField,
    Filter
} from 'react-admin';
import { Box, Typography, Divider } from "@mui/material";

const OrderFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Tìm kiếm mã đơn hàng" source="q" alwaysOn />
        <SelectInput
            label="Trạng thái đơn hàng"
            source="status"
            choices={[
                { id: 'pending', name: 'Chờ xử lý' },
                { id: 'confirmed', name: 'Đã xác nhận' },
                { id: 'shipping', name: 'Đang giao' },
                { id: 'delivered', name: 'Đã giao' },
                { id: 'cancelled', name: 'Đã huỷ' },
            ]}
            alwaysOn
        />
    </Filter>
);

const paymentMethodChoices = [
    { id: 'cash_on_delivery', name: 'Thanh toán khi nhận hàng' },
    { id: 'bank_transfer_qr', name: 'Chuyển khoản QR' },
];

const paymentStatusChoices = [
    { id: 'pending', name: 'Chưa thanh toán' },
    { id: 'paid', name: 'Đã thanh toán' },
    { id: 'failed', name: 'Thanh toán thất bại' },
];
const paymentStatusChoices1 = [
    { id: 'pending', name: 'Chưa thanh toán' },
    { id: 'paid', name: 'Đã thanh toán' },
];

const orderStatusChoices = [
    { id: 'pending', name: 'Chờ xử lý' },
    { id: 'confirmed', name: 'Đã xác nhận' },
    { id: 'shipping', name: 'Đang giao' },
    { id: 'delivered', name: 'Đã giao' },
    { id: 'cancelled', name: 'Đã huỷ' },
];

// Hiển thị danh sách đơn hàng
export const OrderList = (props) => (
    <List filters={<OrderFilter />} {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" label="Mã đơn hàng" />
            {/* User đặt đơn */}
            <ReferenceField label="Người dùng" source="user" reference="users">
                <TextField source="username" />
            </ReferenceField>

            {/* Danh sách sản phẩm trong đơn */}
            <ArrayField source="items" label="Sản phẩm">
                <Datagrid bulkActionButtons={false}>
                    <ReferenceField source="product" reference="products" label="Tên sản phẩm">
                        <TextField
                            source="name"
                            sx={{
                                maxWidth: 120,              // đặt max width
                                display: 'inline-block',    // để ellipsis hoạt động
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                verticalAlign: 'middle',
                            }}
                        />


                        <FunctionField
                            render={(record) =>
                                record && record.images && record.images.length > 0 ? (
                                    <div
                                        style={{
                                            width: '100px',
                                            height: '70px',
                                            backgroundImage: `url(${record.images[0]})`,
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                            borderRadius: '6px',
                                            margin: '5px auto'
                                        }}
                                    />
                                ) : (
                                    <div>No Image</div>
                                )
                            }
                        />
                    </ReferenceField>
                    <FunctionField
                        label="Biến thể"
                        render={(record) => record?.variant?.name || '---'}
                    />
                    <NumberField source="quantity" label="Số lượng" />
                    <NumberField source="price" label="Giá (lúc đặt)" />
                </Datagrid>
            </ArrayField>

            {/* Tổng tiền */}
            <NumberField source="totalPrice" label="Tổng tiền" />

            {/* Phương thức thanh toán */}
            <FunctionField
                label="Thanh toán"
                render={(record) => {
                    const choice = paymentMethodChoices.find(c => c.id === record.paymentMethod);
                    return choice ? choice.name : record.paymentMethod;
                }}
            />

            {/* Trạng thái thanh toán */}
            <FunctionField
                label="TT Thanh toán"
                render={(record) => {
                    const choice = paymentStatusChoices.find(c => c.id === record.paymentStatus);
                    return <ChipField record={{ paymentStatus: choice?.name }} source="paymentStatus" />;
                }}
            />

            {/* Trạng thái đơn hàng */}
            <FunctionField
                label="TT Đơn hàng"
                render={(record) => {
                    const choice = orderStatusChoices.find(c => c.id === record.orderStatus);
                    return <ChipField record={{ orderStatus: choice?.name }} source="orderStatus" />;
                }}
            />

            <TextField source="shippingAddress" label="Địa chỉ giao hàng" />
            <TextField source="note" label="Ghi chú" />
            <BooleanField source="isReviewed" label="Đã đánh giá" />
            <DateField source="createdAt" label="Tạo lúc" showTime />
            <DateField source="updatedAt" label="Cập nhật lúc" showTime />
        </Datagrid>
    </List>
);

export const OrderEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            {/* Thông tin người dùng */}
            <Box mb={2}>
                <Typography variant="h6">Người dùng</Typography>
                <ReferenceField label="Người dùng" source="user" reference="users">
                    <TextField source="username" />
                </ReferenceField>
            </Box>

            <Divider />

            {/* Danh sách sản phẩm */}
            <Box mb={2}>
                <Typography variant="h6">Sản phẩm</Typography>
                <ArrayField source="items">
                    <Datagrid bulkActionButtons={false}>
                        <ReferenceField source="product" reference="products" label="Tên sản phẩm">
                            <TextField source="name" />
                        </ReferenceField>
                        <FunctionField
                            label="Biến thể"
                            render={(record) => record?.variantData?.name || "---"}
                        />
                        <NumberField source="quantity" label="Số lượng" />
                        <NumberField source="price" label="Giá (lúc đặt)" />
                    </Datagrid>
                </ArrayField>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Typography>Tổng tiền: </Typography>
                    <NumberField source="totalPrice" />
                </Box>

            </Box>

            <Divider />

            {/* Thanh toán */}
            <Box>
                <Typography variant="h6">Thanh toán</Typography>
                <SelectField source="paymentMethod" label="Phương thức thanh toán" choices={paymentMethodChoices} />
                <SelectInput source="paymentStatus" label="Trạng thái" choices={paymentStatusChoices1} />
                <TextField source="transactionId" label="Mã giao dịch" />
            </Box>


            {/* Trạng thái đơn hàng */}
            <Box mb={2}>
                <Typography variant="h6">Giao hàng</Typography>
                <SelectInput
                    source="orderStatus"
                    label="Trạng thái đơn hàng"
                    choices={orderStatusChoices}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>Địa chỉ giao hàng: </Typography>
                    <TextField source="shippingAddress" label="Địa chỉ giao hàng" />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>Ghi chú: </Typography>
                    <TextField source="note" label="Ghi chú" />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>Đã đánh giá: </Typography>
                    <BooleanField source="isReviewed" />
                </Box>
            </Box>

            <Divider />

            {/* Thời gian */}
            <Box mb={2}>
                <Typography variant="h6">Thời gian</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>Tạo đơn lúc: </Typography>
                    <DateField source="createdAt" showTime />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>Thanh toán lúc: </Typography>
                    <DateField source="paidTimestamp" showTime />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>Thanh toán thất bại lúc: </Typography>
                    <DateField source="failedTimestamp" showTime />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>Xác nhận đơn lúc: </Typography>
                    <DateField source="confirmedTimestamp" showTime />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>Đang giao lúc: </Typography>
                    <DateField source="shippingTimestamp" showTime />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>Đã giao lúc: </Typography>
                    <DateField source="deliveredTimestamp" showTime />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>Hủy đơn lúc: </Typography>
                    <DateField source="cancelledTimestamp" showTime />
                </Box>


            </Box>
        </SimpleForm>
    </Edit>
);

