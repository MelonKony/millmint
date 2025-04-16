import os
import yaml
import glob
from PIL import Image, ImageTk
import tkinter as tk
from tkinter import ttk

CATEGORIES = [
'animations',
'announcements',
'architecture & design',
'archive',
'characters',
'clothing & uniforms',
'comics',
'commissions & fan art',
'firearms & tools',
'infographics',
'landscapes',
'machines & vehicles',
'maps',
'people & society',
'police & military',
'religion & culture',
'fantasy & spirits',
'sketch',
'story'
]

def load_markdown(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        # Split front matter and content
        if content.startswith('---'):
            _, front_matter, _ = content.split('---', 2)
            return yaml.safe_load(front_matter)
    return None

def save_markdown(file_path, front_matter):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        parts = content.split('---', 2)
    
    # Convert front matter to YAML and preserve formatting
    yaml_content = yaml.dump(front_matter, allow_unicode=True, sort_keys=False)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('---\n')
        f.write(yaml_content)
        f.write('---')
        if len(parts) > 2:
            f.write(parts[2])

class CategoryTagger:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Story Categorizer")
        self.root.geometry("900x600")  # Wider, less tall window
        
        # Main container
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.pack(fill='both', expand=True)
        
        # File info at top
        self.file_label = ttk.Label(main_frame, text="", font=('Arial', 12))
        self.file_label.pack(fill='x')
        
        # Create horizontal layout
        content_frame = ttk.Frame(main_frame)
        content_frame.pack(fill='both', expand=True)
        
        # Left side: Image
        image_frame = ttk.Frame(content_frame, padding="5")
        image_frame.pack(side='left', fill='both', expand=True)
        self.image_label = ttk.Label(image_frame, background='white')
        self.image_label.pack(padx=5, pady=5)
        
        # Right side: Categories and controls
        right_frame = ttk.Frame(content_frame)
        right_frame.pack(side='right', fill='y', padx=10)
        
        # Categories frame with scrollbar
        categories_frame = ttk.LabelFrame(right_frame, text="Categories", padding="5")
        categories_frame.pack(fill='y', expand=True)
        
        # Create checkboxes with command binding
        self.category_vars = {}
        for category in CATEGORIES:
            var = tk.BooleanVar()
            self.category_vars[category] = var
            ttk.Checkbutton(categories_frame, text=category, variable=var, 
                          command=self.on_checkbox_change).pack(anchor='w')
        
        # Controls at bottom of right frame
        controls_frame = ttk.Frame(right_frame)
        controls_frame.pack(fill='x', pady=10)
        
        # Jump to file input
        ttk.Label(controls_frame, text="Jump to #:").pack(side='left')
        self.jump_entry = ttk.Entry(controls_frame, width=10)
        self.jump_entry.pack(side='left', padx=5)
        ttk.Button(controls_frame, text="Go", command=self.jump_to_file).pack(side='left')
        
        # Navigation buttons
        button_frame = ttk.Frame(right_frame)
        button_frame.pack(fill='x')
        ttk.Button(button_frame, text="← Previous", command=self.prev_file).pack(side='left')
        ttk.Button(button_frame, text="Skip", command=self.next_file).pack(side='left', padx=5)
        ttk.Button(button_frame, text="Next →", command=self.next_file).pack(side='right')
        
        # Progress at bottom
        self.progress_label = ttk.Label(right_frame, text="")
        self.progress_label.pack()
        
        # Sort files numerically by extracting the number from the filename
        def get_file_number(filepath):
            try:
                # Strip whitespace from filename before parsing
                return int(os.path.basename(filepath).strip().split('.')[0])
            except ValueError:
                return float('inf')  # Put non-numeric files at the end
        
        self.files = sorted(
            glob.glob('/Users/millmint/Documents/dev/millmint/site/stories/*.md'),
            key=get_file_number
        )
        self.current_index = 0  # Initialize current_index first
        
        # Bind keyboard events
        self.root.bind('<Left>', self.prev_file)
        self.root.bind('<Right>', self.next_file)
        
        # Bind Return key for the jump entry
        self.jump_entry.bind('<Return>', self.jump_to_file)
        
        self.load_current_file()  # Load the first file after everything is set up

    def prev_file(self, event=None):
        if self.current_index > 0:
            self.save_current_state()
            self.current_index -= 1
            self.load_current_file()
    
    def next_file(self, event=None):
        self.save_current_state()
        self.current_index += 1
        if self.current_index < len(self.files):
            self.load_current_file()
        else:
            self.root.quit()

    def jump_to_file(self, event=None):
        try:
            number = int(self.jump_entry.get())
            target_file = f"{number}.md"
            
            for idx, file in enumerate(self.files):
                if os.path.basename(file).strip() == target_file:
                    self.save_current_state()
                    self.current_index = idx
                    self.load_current_file()
                    return
                    
            print(f"No file found matching number {number}")
        except ValueError:
            print("Please enter a valid number")

    def load_current_file(self):
        if self.current_index < len(self.files):
            file_path = self.files[self.current_index]
            front_matter = load_markdown(file_path)
            
            # Update labels
            self.progress_label.config(text=f"File {self.current_index + 1} of {len(self.files)}")
            self.file_label.config(text=os.path.basename(file_path))
            
            if front_matter and 'image' in front_matter:
                image_path = front_matter['image']
                if image_path.startswith('/'):
                    image_path = image_path[1:]
                
                # Try assets directory first
                full_image_path = os.path.join('/Users/millmint/Documents/dev/millmint/assets', image_path)
                
                # If not in assets, try content directory
                if not os.path.exists(full_image_path):
                    full_image_path = os.path.join('/Users/millmint/Documents/dev/millmint/content', image_path)
                
                if os.path.exists(full_image_path):
                    try:
                        img = Image.open(full_image_path)
                        # Calculate resize dimensions maintaining aspect ratio
                        ratio = min(500/img.width, 500/img.height)
                        new_width = int(img.width * ratio)
                        new_height = int(img.height * ratio)
                        
                        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                        photo = ImageTk.PhotoImage(img)
                        self.image_label.configure(image=photo)
                        self.image_label.image = photo
                    except Exception as e:
                        print(f"Error loading image {full_image_path}: {e}")
                        self.image_label.configure(image='', text="Error loading image")
                else:
                    print(f"Image not found: {full_image_path}")
                    self.image_label.configure(image='', text="Image not found")
            
            # Reset all checkboxes first
            for var in self.category_vars.values():
                var.set(False)
            
            # Then set checkboxes based on front matter categories
            if front_matter and 'categories' in front_matter:
                for category in front_matter['categories']:
                    if category in self.category_vars:
                        self.category_vars[category].set(True)

    def save_current_state(self):
        if self.current_index < len(self.files):
            file_path = self.files[self.current_index]
            front_matter = load_markdown(file_path)
            
            if front_matter:
                # Get current categories from checkboxes
                categories = []
                for category, var in self.category_vars.items():
                    if var.get():
                        categories.append(category)
                
                # Replace entire categories list
                front_matter['categories'] = categories
                save_markdown(file_path, front_matter)

    def run(self):
        self.root.mainloop()

    def on_checkbox_change(self):
        # Save state immediately when any checkbox changes
        self.save_current_state()

if __name__ == "__main__":
    app = CategoryTagger()
    app.run()