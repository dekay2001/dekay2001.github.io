<main id="home_content" class="content">
    <!-- Left -->
    <div id="left">
    </div>
    <!-- Middle -->
    <div id="middle" >
        <ul>
            {% for post in site.posts %}
                <li>
                    <a href="{{ post.url }}">{{ post.title }}</a>
                </li>
            {% endfor %}
        </ul>
    </div>
    <!--Right -->
    <div id="right">
    </div>
</main>