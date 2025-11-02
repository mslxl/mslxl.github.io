// #set page(margin: 0em)
// #set text(size: 16pt)

#let hyperlink(url, content) = link(url)[
  #underline(content)
]

#let friend(name, avatar: "", url: "") = box(
  radius: 50%,
  // fill: rgb("#eee"),
  stroke: rgb("#000"),
)[
  #context {
    let content = [
      #box(
        width: 1em,
        height: 1em,
        fill: rgb("#eee"),
        stroke: rgb("#000"),
        radius: 100%,
        align(center + horizon,
          if avatar != "" {
            image(avatar)
          }else{
            set text(size: text.size - 0.2em)
            text(fill: if url != "" { blue}else{rgb("#000")}, "@")
          }
        )
      )
      #box(
        height: 1em,
        inset: (right: 0.5em),
        [
          #set text(size: text.size - 0.2em)
          #align(center + horizon,
            text(name)
          )
        ]
      )
    ]
    if url != "" {
      link(url)[
        #content
      ]
    }else{
      content
    }
  }
]

#let dead(name) = box(stroke: rgb("#000"), inset: (left:0.2em,right:0.2em), height: 1em)[
  #context {
    set text(size: text.size - 0.4em)
    align(horizon)[#name]
  }
]