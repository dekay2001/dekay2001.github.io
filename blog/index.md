<!-- Left -->
<div id="left">
<!-- {{ 'logo.png' | asset_url | img_tag: 'The Soap Store', 'css--class1 css--class2' }} 
<img src="//cdn.shopify.com/s/files/1/0222/9076/t/10/assets/logo.png?796" alt="The Soap Store" class="css--class1 css--class2">
<img src="{{ 'logo.png' | asset_url }}" alt="The Soap Store" class="css--class1 css--class2" id="logo">
-->
    <!-- <img id="blog-main-pic" src="/assets/images/main.jpg"alt="Sunset over the pacific eastern most point in europe"> -->
    <!-- <img id="blog-main-pic" src="{{ 'main.jpg' | asset_url }}"alt="Sunset over the pacific eastern most point in europe"> -->
    ![Sunset Over the Pacific](/assets/images/main.jpg){:class="img-responsive"}
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
