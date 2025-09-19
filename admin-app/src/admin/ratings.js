import {
    ReferenceField,
    useInput,
    List,
    Datagrid,
    TextField,
    Edit,
    SimpleForm,
    TextInput,
    SelectInput,
    DateField,
    ReferenceInput,
    FunctionField,
    NumberField,
} from 'react-admin';

const ratingFilters = [
    <ReferenceInput
        label="Sản phẩm"
        source="product"
        reference="products"
        alwaysOn
    >
        <SelectInput optionText="name" />
    </ReferenceInput>
];


// Custom field để upload và hiển thị ảnh
const CustomInputImagesField = ({ source }) => {
    const { field } = useInput({ source });

    // Ép giá trị thành mảng
    const images = Array.isArray(field.value) ? field.value : [];
    

    return (
        <div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {images.map((image, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                        <div
                            style={{
                                width: '250px',
                                height: '150px',
                                backgroundImage: `url(${image.src || image})`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                borderRadius: '10px',
                                border: '1px solid #ccc',
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};



// Danh sách sản phẩm
export const RatingList = (props) => (
    <List filters={ratingFilters} {...props}>
        <Datagrid rowClick="edit">
            <ReferenceField label="Mã đơn hàng" source="order" reference="orders">
                <TextField source="id" />
            </ReferenceField>
            <ReferenceField label="Sản phẩm" source="product" reference="products">
                <TextField source="name" />
            </ReferenceField>
            <ReferenceField label="Người dùng" source="user" reference="users">
                <TextField source="username" />
            </ReferenceField>
            <NumberField source="rating" label="Đánh giá" />
            <TextField source="comment" label="Bình luận" />
            <FunctionField
                label="Ảnh"
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
                                margin: '5px auto',
                            }}
                        />
                    ) : (
                        <div>No Image</div>
                    )
                }
            />
            <DateField source="createdAt" label="Tạo lúc" showTime />
            <DateField source="updatedAt" label="Cập nhật lúc" showTime />
        </Datagrid>
    </List>
);

export const RatingEdit = () => (
    <Edit>
        <SimpleForm  toolbar={false}>
            <ReferenceInput source="order" reference="orders" label="Mã đơn">
                <SelectInput optionText="id" InputProps={{ readOnly: true }}/>
            </ReferenceInput>
            <ReferenceInput source="product" reference="products" label="Sản phẩm">
                <SelectInput optionText="name" InputProps={{ readOnly: true }} />
            </ReferenceInput>
            <ReferenceInput source="user" reference="users" label="Người dùng">
                <SelectInput optionText="username" InputProps={{ readOnly: true }} />
            </ReferenceInput>
            <TextInput source="rating" label="Đánh giá" InputProps={{ readOnly: true }} />
            <TextInput source="comment" label="Bình luận" InputProps={{ readOnly: true }} multiline />
            <CustomInputImagesField source="images" InputProps={{ readOnly: true }} />
        </SimpleForm>
    </Edit>
);


// // Tạo mới sản phẩm
// export const RatingCreate = () => (
//     <Create>
//         <SimpleForm>
//             <ReferenceInput source="order" reference="orders" label="Mã đơn">
//                 <SelectInput optionText="id" />
//             </ReferenceInput>
//             <ReferenceInput source="product" reference="products" label="Sản phẩm">
//                 <SelectInput optionText="name" />
//             </ReferenceInput>
//             <ReferenceInput source="user" reference="users" label="Người dùng">
//                 <SelectInput optionText="username" />
//             </ReferenceInput>
//             <NumberInput source="rating" label="Đánh giá" min={1} max={5} />
//             <TextInput source="comment" label="Bình luận" />
//             <CustomInputImagesField source="images" />
//         </SimpleForm>
//     </Create>
// );
