# LibDate - Images Setup Guide

## Adding Your Profile Images

The website is configured to use images from the `images/` directory.

### Main Profile Image
- **Location:** `images/profile-main.jpg`
- **Used in:** 
  - Profile page (main photo)
  - Featured profiles on home page
  - Search results
  - Messaging (conversation avatar)
  - Matches section

### Liberian Flag Logo
- **Location:** `images/liberia-flag.jpg`
- **Used in:** Navigation bar on all pages (next to LibDate logo)
- **Recommended Size:** ~35px height (will auto-scale)

### How to Add Images

1. **Create the `images` folder** (if it doesn't exist)
   - Path: `c:\Users\USER\dennisdate\images\`

2. **Add your image files:**
   - Save your profile photo as `profile-main.jpg` in the images folder
   - The image will automatically display across all pages

### Recommended Image Specifications

**Profile Photo:**
- **Format:** JPG, PNG, or WebP
- **Size:** 1200x1500 pixels (portrait)
- **File Size:** Keep under 500KB for fast loading
- **Aspect Ratio:** Portrait (3:4) works best

**Flag Logo:**
- **Format:** JPG, PNG, or WebP
- **Size:** Any width, 35px height (will auto-scale)
- **File Size:** Keep under 100KB
- **Aspect Ratio:** Landscape (any, typically flag aspect ratio)

### Adding More Profile Images

To add different photos for different profiles, create new image files:

```
images/
├── liberia-flag.jpg       (Liberian flag in navbar)
├── profile-main.jpg       (Sarah - Featured)
├── profile-emma.jpg       (Emma Davis)
├── profile-jessica.jpg    (Jessica Martinez)
├── profile-lisa.jpg       (Lisa Anderson)
└── ...
```

Then update the HTML files to reference these images instead of using the same photo everywhere.

### Example: Updating Search Results with Different Photos

In `search.html`, change the `src` attribute:
```html
<!-- Result 1 - Sarah -->
<img src="images/profile-main.jpg" alt="Profile">

<!-- Result 2 - Emma -->
<img src="images/profile-emma.jpg" alt="Profile">

<!-- Result 3 - Jessica -->
<img src="images/profile-jessica.jpg" alt="Profile">
```

Enjoy your dating website! 💕
