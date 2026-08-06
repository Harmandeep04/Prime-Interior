// backend/scripts/migrateImages.js
// ✅ Ik-vaari script — backend/images folder diyan saariyan images Cloudinary te upload karo
//    te MongoDB ch products diyan image/hoverImage URLs update karo.
//
// Chalaan da tarika (backend folder de andar terminal ch):
//   node scripts/migrateImages.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cloudinary from '../config/cloudinary.js';
import Product from '../model/productSchema.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, '..', 'images');

const run = async () => {
  try {
    // ✅ Same DB naal connect karo jehda backend use karda hai
    await mongoose.connect('mongodb+srv://Harmandeep:Harmandeep@cluster0.vfs3wif.mongodb.net/Harmandeep');
    console.log('✅ MongoDB connected');

    if (!fs.existsSync(imagesDir)) {
      console.log('❌ images folder nahi mili:', imagesDir);
      return;
    }

    const files = fs.readdirSync(imagesDir).filter(f =>
      /\.(jpg|jpeg|png|webp|gif)$/i.test(f)
    );
    console.log(`📁 ${files.length} images mil gaiyan migrate karan layi...`);

    // ✅ filename -> naveen Cloudinary URL da map banao
    const urlMap = {};

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i];
      const filePath = path.join(imagesDir, fileName);
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'prime-interior-products',
        });
        urlMap[fileName] = result.secure_url;
        console.log(`✅ (${i + 1}/${files.length}) Uploaded: ${fileName}`);
      } catch (err) {
        console.log(`❌ Failed: ${fileName} —`, err.message);
      }
    }

    // ✅ Hun saare products fetch karo te jinhan diyan images purane localhost URL ne, unhe update karo
    const products = await Product.find();
    let updatedCount = 0;

    for (const product of products) {
      let changed = false;
      const updates = {};

      for (const field of ['image', 'hoverImage']) {
        const oldUrl = product[field];
        if (!oldUrl) continue;
        // URL ch se sirf filename kadho (jiwe "product_1781248710480.jpg")
        const fileName = oldUrl.split('/').pop();
        if (urlMap[fileName]) {
          updates[field] = urlMap[fileName];
          changed = true;
        }
      }

      if (changed) {
        await Product.findByIdAndUpdate(product._id, updates);
        updatedCount++;
        console.log(`🔄 Updated product: ${product.name}`);
      }
    }

    console.log(`\n🎉 Migration complete! ${files.length} images uploaded, ${updatedCount} products updated.`);
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();