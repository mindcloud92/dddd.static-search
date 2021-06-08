# dddd.jekyll-search

### Usecases
- [DdDd](http://super-dev.xyz/search/?q=jekyll)

### Project structure
```text
project
    ├─ _layouts
        ├─ search.html
        ...
    ├─ search.md 
    ...
```

### Getting Started
1. add `search.md`
  ```markdown
  ---
  layout: search
  ---
  ```

2. add `search.html`
  - implement search area markup
    ```html
    <div class="contents-wrapper">
        <form type="submit" action="{search path}" class="search-input-wrapper">
            <input id="{search input id}" type="text" name="{search paramter name}" placeholder="{placeholder}" />
            <button type="submit" class="icon search"></button>
        </form>

        <section id="{search result container id}" class="mt-2">
        </section>
    </div>
    ```
    
  - import `dddd.jekyll-search` library with CDN
    ```html
    <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/mindcloud92/dddd.jekyll-search@0ab8dab9e32442808897bd0a203a951aeb36694c/src/static/js/dddd.jekyll-search.js"></script>
    ```
    
  2-1. When using the default template engine(default: underscore)
    
  - import template engine library with CDN
    ```html
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/underscore@1.13.1/underscore-umd-min.js"></script>
    ```

  - implement onload event
    ```html
    <script type="text/javascript">
        window.onload = () => {
            new dddd.jekyll.Search({
                posts: getAllPost()
            })
        }

        function getAllPost () {
            return [
                {% for post in site.posts %}
                {
                    "title": "{{ post.title | xml_escape }}",
                    "categories": [{% for category in post.categories %} "{{ category }}" {% unless forloop.last %},{% endunless %} {% endfor %}],
                    "content": {{ post.content | strip_html | strip_newlines | jsonify }},
                    "tags": [{% for tag in post.tags %} "{{ tag }}" {% unless forloop.last %},{% endunless %} {% endfor %}],
                    "date": "{{ post.date }}",
                    "url": "{{ post.url | xml_escape | relative_url }}"
                }
                {% unless forloop.last %},{% endunless %}
                {% endfor %}
            ]
        }
    </script>
    ```
  
  - define search result template
    ```html
    <script id="template-post-list" type="text/template">
      <!-- search result template -->
    </script>
    ```
