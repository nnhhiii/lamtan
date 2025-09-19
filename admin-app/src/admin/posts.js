import {
    List, Edit, Create,
    Datagrid, SimpleForm,
    TextField, ImageField,
    TextInput, ImageInput, FunctionField, DateField,
    ReferenceField, ReferenceInput, SelectInput
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

const postFilters = [
    <TextInput label="Tìm kiếm" source="q" alwaysOn />
];

// Render ảnh thumbnail
const renderPostImage = (record) => (
    record.image ? (
        <div
            style={{
                width: '150px',
                height: '100px',
                backgroundImage: `url(${record.image})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                borderRadius: '6px',
                margin: '5px auto'
            }}
        />
    ) : <div>No Image</div>
);

// ✅ Danh sách bài viết
export const PostList = (props) => (
    <List filters={postFilters} {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" label="Tiêu đề" />

            <TextField
                source="description"
                label="Nội dung"
                sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal'
                }}
            />

            <ReferenceField source="postCategory" reference="postCategories" label="Danh mục">
                <TextField source="name" />
            </ReferenceField>

            <FunctionField render={renderPostImage} label="Ảnh thumbnail" />
            <DateField source="createdAt" label="Tạo lúc" showTime />
            <DateField source="updatedAt" label="Cập nhật lúc" showTime />
        </Datagrid>
    </List>
);

// ✅ Chỉnh sửa bài viết
export const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" label="Tiêu đề" />
            <RichTextInput source="description" label="Nội dung" />

            <ReferenceInput source="postCategory" reference="postCategories" label="Danh mục">
                <SelectInput optionText="name" />
            </ReferenceInput>

            <ImageField source="image" label="Ảnh hiện tại" />
            <ImageInput source="image" label="Thay ảnh mới" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Edit>
);

// ✅ Tạo mới bài viết
export const PostCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" label="Tiêu đề" />
            <RichTextInput source="description" label="Nội dung" />

            <ReferenceInput source="postCategory" reference="postCategories" label="Danh mục">
                <SelectInput optionText="name" />
            </ReferenceInput>

            <ImageInput source="image" label="Ảnh thumbnail" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Create>
);
