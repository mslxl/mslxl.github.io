{ stdenv
, fetchurl
, gccgo12
, dpkg
, glib
, autoPatchelfHook
} :

let version = "0.118.2"; in
stdenv.mkDerivation {
  name = "hugo-extended";
  system = "x86_64-linux";

  nativeBuildInputs = [
    autoPatchelfHook
    dpkg
  ];

  buildInputs = [
    gccgo12
    glib
  ];

  src = fetchurl {
    url = "https://github.com/gohugoio/hugo/releases/download/v${version}/hugo_extended_${version}_linux-amd64.deb";
    hash = "sha256-PdT8cW9Co5ziC0gany76FFHjK2IpVJ3CuDNDvFqClxs=";
  };

  unpackPhase = ''
    ar x $src
    tar xf data.tar.gz
  '';

  # Extract and copy executable in $out/bin
  installPhase = ''
  mkdir -p $out/bin
  cp usr/local/bin/hugo $out/bin/hugo
  '';

  meta = with stdenv.lib; {
    description = "Hugo-extended";
    homepage = https://gohugo.io/;
    # license = licenses.unfree;
    maintainers = with stdenv.lib.maintainers; [ ];
    platforms = [ "x86_64-linux" ];
  };
}