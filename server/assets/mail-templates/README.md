# Rules for html mail templates

Many email clients have limited and undocumented support for html rendering.
Therefore, we need to follow these rules for our html too look good on as many clients as possible.

The resulting css and html may look ugly and redundant, but it is what it is, we can't change the world... 😒 

## CSS
- Try to write as little css as possible.
- Use css class selector. It seems to be the most stable selector across email clients.
    ```css
    .my-css-class {
        /* css props... */
    }
    ```
- Use `<div>` instead of `display: block` or `display: inline-block`
- Gmail likes to override your text color, it is ok to be overly specific with text coloring. For example:
    ```html 
    <div style="color: black;">
        <div>
            <a>
                <!-- Prevent text from turning blue -->
                <span style="color: black;">
                    Lorum ipsum...
                </span>
            </a>
        </div>

        <!-- For some reason, gmail will make this text purple unless we specifically override it here -->
        <div style="color: black;">
            Lorum ipsum...
        </div>
    </div>

    ```

## HTML 
- Don't use semantic elements such as `body`, `main`, `footer` or `section`. Use `div` instead.

## Watermark in footer
Email clients will clip off the email when it is identical to previous email. E.G the footer will not be rendered if it is identical to the footer of the last email. To circumvent this, you should either:

1. Ensure that the text at the end of the email is unique.
2. Ensure that the end of the email is unique by adding an invisible uuid at the end. Use this css class to hide the element:
    ```css 
    .invisible {
        display: none;
        font-size: 0px;     /* in case display-none isn't working */
        max-height:0px; 
        overflow: hidden;    /* for gmail */
        opacity: 0;
        visibility: hidden;
        display: none; 
        mso-hide: all;      /* for outlook */ 
    }
    ```

## Testing
When you have changed the css or html tags of an email, you should test it on as many clients as possible.

### Refactor
Make sure to test that the email looks correctly when you have refactored a email template.