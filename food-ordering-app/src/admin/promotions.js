import {
    List,
    Datagrid,
    TextField,
    DateField,
    BooleanField,
    Edit,
    SimpleForm,
    TextInput,
    DateInput,
    Create,
    ReferenceArrayInput,
    SelectInput,
    SelectArrayInput,
    ReferenceArrayField,
    SingleFieldList,
    ChipField,
    BooleanInput,
    NumberInput,
    FunctionField,
    ArrayInput,
    SimpleFormIterator
} from 'react-admin';

// Bộ lọc tìm kiếm
const promotionFilters = [
    <TextInput label="Tìm kiếm" source="q" alwaysOn />
];

// ====== LIST ======
export const PromotionList = (props) => (
    <List filters={promotionFilters} {...props}>
        <Datagrid rowClick="edit">
            <TextField source="code" label="Mã giảm giá" />
            <TextField source="title" label="Tiêu đề" />
            <FunctionField
                label="Loại"
                render={record => record.type === 'discount' ? 'Giảm giá' : 'Vận chuyển'}
            />
            {/* Categories nhiều */}
            <ReferenceArrayField label="Danh mục áp dụng" source="categories" reference="categories">
                <SingleFieldList>
                    <ChipField source="name" />
                </SingleFieldList>
            </ReferenceArrayField>

            {/* Hiển thị nhiều tiers */}
            <FunctionField
                label="Tiers"
                render={record =>
                    record.tiers?.map(
                        t =>
                            `Đơn từ ${t.minOrderValue.toLocaleString("vi-VN")}đ: ${
                                t.discountType === "percentage"
                                    ? `${t.discountValue}%`
                                    : `${t.discountValue.toLocaleString("vi-VN")}đ`
                            }`
                    ).join(" | ")
                }
            />

            <DateField source="startDate" label="Bắt đầu" showTime />
            <DateField source="endDate" label="Kết thúc" showTime />
            <TextField source="usageLimit" label="Giới hạn" />
            <TextField source="usedCount" label="Đã dùng" />
            <BooleanField source="isActive" label="Kích hoạt" />
        </Datagrid>
    </List>
);

// ====== CREATE ======
export const PromotionCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="code" label="Mã giảm giá" />
            <TextInput source="title" label="Tiêu đề" />
            <TextInput source="description" label="Mô tả" multiline />

            {/* Categories nhiều */}
            <ReferenceArrayInput source="categories" reference="categories" label="Danh mục áp dụng">
                <SelectArrayInput optionText="name" />
            </ReferenceArrayInput>

            <SelectInput source="type" label="Loại" choices={[
                { id: 'discount', name: 'Giảm giá' },
                { id: 'shipping', name: 'Vận chuyển' }
            ]} />

            {/* Tiers */}
            <ArrayInput source="tiers" label="Các mức giảm">
                <SimpleFormIterator>
                    <NumberInput source="minOrderValue" label="Đơn tối thiểu" />
                    <SelectInput source="discountType" label="Kiểu giảm" choices={[
                        { id: 'percentage', name: 'Phần trăm' },
                        { id: 'fixed', name: 'Số tiền' }
                    ]} />
                    <NumberInput source="discountValue" label="Giá trị giảm" />
                    <NumberInput source="maxDiscountValue" label="Giảm tối đa" />
                </SimpleFormIterator>
            </ArrayInput>

            <DateInput source="startDate" label="Bắt đầu" />
            <DateInput source="endDate" label="Kết thúc" />
            <NumberInput source="usageLimit" label="Giới hạn sử dụng" />
            <BooleanInput source="isActive" label="Kích hoạt" />
        </SimpleForm>
    </Create>
);

// ====== EDIT ======
export const PromotionEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="code" label="Mã giảm giá" />
            <TextInput source="title" label="Tiêu đề" />
            <TextInput source="description" label="Mô tả" multiline />

            <ReferenceArrayInput source="categories" reference="categories" label="Danh mục áp dụng">
                <SelectArrayInput optionText="name" />
            </ReferenceArrayInput>

            <SelectInput source="type" label="Loại" choices={[
                { id: 'discount', name: 'Giảm giá' },
                { id: 'shipping', name: 'Vận chuyển' }
            ]} />

            {/* Tiers chỉnh sửa */}
            <ArrayInput source="tiers" label="Các mức giảm">
                <SimpleFormIterator>
                    <NumberInput source="minOrderValue" label="Đơn tối thiểu" />
                    <SelectInput source="discountType" label="Kiểu giảm" choices={[
                        { id: 'percentage', name: 'Phần trăm' },
                        { id: 'fixed', name: 'Số tiền' }
                    ]} />
                    <NumberInput source="discountValue" label="Giá trị giảm" />
                    <NumberInput source="maxDiscountValue" label="Giảm tối đa" />
                </SimpleFormIterator>
            </ArrayInput>

            <DateInput source="startDate" label="Bắt đầu" />
            <DateInput source="endDate" label="Kết thúc" />
            <NumberInput source="usageLimit" label="Giới hạn sử dụng" />
            <NumberInput source="usedCount" label="đã dùng" />
            <BooleanInput source="isActive" label="Kích hoạt" />
        </SimpleForm>
    </Edit>
);
