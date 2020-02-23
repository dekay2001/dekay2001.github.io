---
content_class: "post-list"
---
<ul>
    {% for post in site.posts %}
        <li>
            <a class="postlink" href="{{ post.url }}">{{ post.title }} {{ page.date | date: "%m/%d/%Y" }}</a>
        </li>
    {% endfor %}
</ul>
