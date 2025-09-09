const supabase = require("./supabase");

/**
 * Upload file lên Supabase Storage
 * @param {Object} file - file từ multer (có buffer, mimetype, originalname)
 * @param {String} bucket - tên bucket trên Supabase
 * @returns {Promise<string>} public URL của file đã upload
 */
async function uploadToSupabase(file, bucket = "uploads") {
    try {
        if (!file) throw new Error("No file provided");

        const fileName = `${Date.now()}-${file.originalname}`;

        // Upload file lên bucket
        const { error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) throw error;

        // Lấy public URL
        const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

        return data.publicUrl;
    } catch (err) {
        console.error("Upload to Supabase failed:", err.message);
        throw err;
    }
}

module.exports = uploadToSupabase;
