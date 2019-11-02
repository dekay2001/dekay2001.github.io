<ul>
    {% for post in site.posts %}
        <li>
            <a class="postlink" href="{{ post.url }}">{{ post.title }}</a>
        </li>
    {% endfor %}
</ul>
