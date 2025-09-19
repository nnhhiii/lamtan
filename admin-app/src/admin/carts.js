import {
    List,
    Datagrid,
    TextField, ArrayField, NumberField, DateField, ReferenceField, FunctionField,SelectInput,ReferenceInput
} from 'react-admin';

const userFilters = [
    <ReferenceInput
        label="Người dùng"
        source="user"
        reference="users"
        alwaysOn
    >
        <SelectInput optionText="username" />
    </ReferenceInput>
];

// Hiển thị danh sách giỏ hàng
export const CartList = (props) => (
    <List filters={userFilters} {...props}>
        <Datagrid rowClick="edit">
            <ReferenceField label="Người dùng" source="user" reference="users">
                <TextField source="username" />
            </ReferenceField>

            <ArrayField source="items" label="Các sản phẩm">
                <Datagrid bulkActionButtons={false}>
                    <ReferenceField source="product" reference="products" label="Tên sản phẩm">
                        <TextField source="name" />
                        <FunctionField
                            render={(record) =>
                                record && record.images && record.images.length > 0 ? (
                                    <div
                                        style={{
                                            width: '150px',
                                            height: '100px',
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
                        render={(record) => record?.variantData?.name || '---'}
                    />
                    <NumberField source="quantity" label="Số lượng" />
                </Datagrid>
            </ArrayField>
            <DateField source="createdAt" label="Tạo lúc" showTime />
            <DateField source="updatedAt" label="Cập nhật lúc" showTime />
        </Datagrid>
    </List>
);
