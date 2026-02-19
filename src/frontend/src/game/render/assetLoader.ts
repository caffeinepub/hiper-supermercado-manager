export interface GameAssets {
  tileset: HTMLImageElement;
  departmentCounters: HTMLImageElement;
  uiIcons: HTMLImageElement;
  aisleShelves: HTMLImageElement;
  floor: HTMLImageElement;
  checkoutRegisters: HTMLImageElement;
  customerSprites: HTMLImageElement;
  employeeSprites: HTMLImageElement;
}

let cachedAssets: GameAssets | null = null;
let loadingPromise: Promise<GameAssets> | null = null;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

export async function loadAssets(): Promise<GameAssets> {
  // Return cached assets if already loaded
  if (cachedAssets) {
    return cachedAssets;
  }
  
  // Return existing loading promise if already loading
  if (loadingPromise) {
    return loadingPromise;
  }
  
  // Start loading all assets
  loadingPromise = (async () => {
    try {
      const [
        tileset,
        departmentCounters,
        uiIcons,
        aisleShelves,
        floor,
        checkoutRegisters,
        customerSprites,
        employeeSprites,
      ] = await Promise.all([
        loadImage('/assets/generated/hsm-tileset.dim_2048x2048.png'),
        loadImage('/assets/generated/department-counters.dim_1024x1024.png'),
        loadImage('/assets/generated/hsm-ui-icons.dim_1024x1024.png'),
        loadImage('/assets/generated/aisle-shelves-tileset.dim_1024x1024.png'),
        loadImage('/assets/generated/supermarket-floor.dim_512x512.png'),
        loadImage('/assets/generated/checkout-registers.dim_1024x512.png'),
        loadImage('/assets/generated/customers-sprites.dim_1024x1024.png'),
        loadImage('/assets/generated/employees-sprites.dim_1024x1024.png'),
      ]);
      
      cachedAssets = {
        tileset,
        departmentCounters,
        uiIcons,
        aisleShelves,
        floor,
        checkoutRegisters,
        customerSprites,
        employeeSprites,
      };
      
      return cachedAssets;
    } catch (error) {
      loadingPromise = null;
      throw error;
    }
  })();
  
  return loadingPromise;
}

export function getAssets(): GameAssets | null {
  return cachedAssets;
}
