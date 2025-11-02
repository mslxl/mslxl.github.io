{
  description = "astro env";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };
  outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forEachSupportedSystem = f: nixpkgs.lib.genAttrs supportedSystems (system: f {
        pkgs = import nixpkgs { inherit system; };
      });
    in
    {
      devShells = forEachSupportedSystem ({ pkgs }:
        {
          default = pkgs.mkShell {
            buildInputs = [
              pkgs.nixpkgs-fmt
            ];
            nativeBuildInputs = with pkgs; [
              playwright-driver.browsers
            ];
            packages = (with pkgs; [
              tinymist
              mdl

              shellcheck
             
              jq
              nodejs
              nodejs.pkgs.pnpm
            ]);
            # Fontconfig error: Cannot load default config file
            FONTCONFIG_FILE = pkgs.makeFontsConf {
              fontDirectories = with pkgs; [
                nerd-fonts.iosevka
                maple-mono.CN
                source-han-sans
                source-han-serif
              ];
            };
            PLAYWRIGHT_BROWSERS_PATH="${pkgs.playwright-driver.browsers}";
            PLAYWRIGHT_VERSION="${pkgs.playwright-driver.version}";
            PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS="true";
            shellHook = ''
              jq --arg version "$PLAYWRIGHT_VERSION" '.devDependencies.playwright = $version' package.json > tmp.json && mv tmp.json package.json

              if [ ! -d "node_modules" ]; then pnpm install; fi
              export PROJ_NIX_ENV=1

              env | grep ^PLAYWRIGHT
            '';
          };
      });
    };

}
