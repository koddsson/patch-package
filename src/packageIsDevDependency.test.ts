import { packageIsDevDependency } from "./packageIsDevDependency";
import { join } from "./path";
import { normalize } from "path";
import { getPackageDetailsFromPatchFilename } from "./PackageDetails";
import { existsSync } from "fs";

const appPath = normalize(join(__dirname, "../"));

describe(packageIsDevDependency, () => {
  it("returns true if package is a dev dependency", () => {
    expect(
      packageIsDevDependency({
        appPath,
        patchDetails: getPackageDetailsFromPatchFilename(
          "typescript+3.0.1.patch",
        )!,
      }),
    ).toBe(true);
  });
  it("returns false if package is not a dev dependency", () => {
    expect(
      packageIsDevDependency({
        appPath,
        patchDetails: getPackageDetailsFromPatchFilename("chalk+3.0.1.patch")!,
      }),
    ).toBe(false);
  });
  it("returns false if package is a transitive dependency of a dev dependency", () => {
    expect(existsSync(join(appPath, "node_modules/jest-circus"))).toBe(
      true,
    );
    expect(
      packageIsDevDependency({
        appPath,
        patchDetails: getPackageDetailsFromPatchFilename(
          // jest-circus is a transitive dep of jest
          "jest-circus+3.0.1.patch",
        )!,
      }),
    ).toBe(false);
  });
});
